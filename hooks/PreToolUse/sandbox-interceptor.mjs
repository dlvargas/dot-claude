#!/usr/bin/env node
/**
 * PreToolUse Sandbox Interceptor
 *
 * Intercepts ALL tool calls and:
 * 1. Unsanitizes paths in commands (Claude sends sanitized, we execute real)
 * 2. Validates paths are within allowed boundaries
 * 3. Blocks access to sensitive locations
 * 4. Logs the mapping for the PostToolUse sanitizer
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join, isAbsolute } from 'path';
import { homedir } from 'os';
import { tmpdir } from 'os';

const HOME = homedir();
const USERNAME = process.env.USER || process.env.USERNAME || 'user';
const PROJECT_ROOT = process.cwd();
const SANDBOX_STATE = join(tmpdir(), 'claude-sandbox-state.json');

// Load or create sandbox state
function loadState() {
  try {
    if (existsSync(SANDBOX_STATE)) {
      return JSON.parse(readFileSync(SANDBOX_STATE, 'utf8'));
    }
  } catch {}
  return {
    projectRoot: PROJECT_ROOT,
    mappings: { pathToSafe: {}, safeToPath: {} },
    pendingCommands: {}
  };
}

function saveState(state) {
  try {
    writeFileSync(SANDBOX_STATE, JSON.stringify(state, null, 2));
  } catch {}
}

// Reverse sanitize paths in text
function unsanitizePaths(text, state) {
  if (!text) return text;

  let result = text;

  // Replace $PROJECT paths
  result = result.replace(/\$PROJECT(?:\/[^\s"']+)?/g, (match) => {
    const relPath = match.replace(/^\$PROJECT\/?/, '');
    return relPath ? join(state.projectRoot, relPath) : state.projectRoot;
  });

  // Replace /home/user paths
  result = result.replace(/\/home\/user(?:\/[^\s"']+)?/g, (match) => {
    const relPath = match.replace('/home/user/', '');
    return relPath ? join(HOME, relPath) : HOME;
  });

  // Replace [EXT:hash] paths using mappings
  result = result.replace(/\[EXT:[a-f0-9]+\](?:\/[^\s"']+)?/g, (match) => {
    return state.mappings.safeToPath[match] || match;
  });

  // Replace literal 'user' username in paths that look like they need the real username
  result = result.replace(/\/Users\/user\//g, `/Users/${USERNAME}/`);

  return result;
}

// Validate path is allowed
function isPathAllowed(path, state) {
  const absPath = isAbsolute(path) ? path : resolve(state.projectRoot, path);

  // Always allow project paths
  if (absPath.startsWith(state.projectRoot)) return true;

  // Allow home .claude directory
  if (absPath.startsWith(join(HOME, '.claude'))) return true;

  // Allow system paths (executables)
  const systemPaths = ['/usr', '/bin', '/sbin', '/opt', '/etc', '/var', '/tmp'];
  if (systemPaths.some(sp => absPath.startsWith(sp))) return true;

  // Allow homebrew
  if (absPath.startsWith('/opt/homebrew')) return true;

  // Block everything else by default (can be configured)
  return false;
}

// Extract paths from command
function extractPaths(command) {
  const paths = [];

  // Match absolute paths
  const absPathMatch = command.match(/(?:^|\s)(\/[^\s"'|><&;]+)/g);
  if (absPathMatch) {
    paths.push(...absPathMatch.map(p => p.trim()));
  }

  // Match $PROJECT paths
  const projectMatch = command.match(/\$PROJECT(?:\/[^\s"'|><&;]+)?/g);
  if (projectMatch) {
    paths.push(...projectMatch);
  }

  // Match /home/user paths
  const homeMatch = command.match(/\/home\/user(?:\/[^\s"'|><&;]+)?/g);
  if (homeMatch) {
    paths.push(...homeMatch);
  }

  return paths;
}

// Check for blocked commands
function isBlockedCommand(command) {
  const blocked = [
    /^\s*sudo\s/,
    /^\s*su\s/,
    /^\s*passwd\b/,
    /^\s*chown\s/,
    /^\s*mount\s/,
    /^\s*umount\s/,
    /rm\s+-rf\s+\/(?!tmp)/,  // rm -rf / (but allow /tmp)
    />\s*\/etc\//,           // Writing to /etc
    />\s*\/usr\//,           // Writing to /usr
  ];

  return blocked.some(pattern => pattern.test(command));
}

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));
  const state = loadState();

  // Handle Bash tool
  if (input.tool_name === 'Bash') {
    let command = input.tool_input?.command || '';

    // Check for blocked commands
    if (isBlockedCommand(command)) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "Command blocked by sandbox policy"
        }
      }));
      process.exit(0);
    }

    // Unsanitize paths in command
    const unsanitizedCommand = unsanitizePaths(command, state);

    // Validate paths
    const paths = extractPaths(unsanitizedCommand);
    for (const path of paths) {
      if (!isPathAllowed(path, state)) {
        console.log(JSON.stringify({
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: `Path access denied: ${path} is outside allowed boundaries`
          }
        }));
        process.exit(0);
      }
    }

    // Store pending command for PostToolUse
    state.pendingCommands[input.tool_use_id] = {
      original: command,
      unsanitized: unsanitizedCommand,
      timestamp: Date.now()
    };
    saveState(state);

    // If command was modified, tell Claude Code to use the unsanitized version
    if (unsanitizedCommand !== command) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          modifiedInput: {
            command: unsanitizedCommand
          },
          sandboxInfo: {
            originalCommand: command,
            pathsTranslated: paths.length
          }
        }
      }));
    }
  }

  // Handle Read tool
  if (input.tool_name === 'Read') {
    let filePath = input.tool_input?.file_path || '';

    // Unsanitize path
    const unsanitizedPath = unsanitizePaths(filePath, state);

    // Validate
    if (!isPathAllowed(unsanitizedPath, state)) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: `Read access denied: ${filePath} is outside allowed boundaries`
        }
      }));
      process.exit(0);
    }

    // Store for PostToolUse
    state.pendingCommands[input.tool_use_id] = {
      tool: 'Read',
      originalPath: filePath,
      unsanitizedPath: unsanitizedPath
    };
    saveState(state);

    // Modify if needed
    if (unsanitizedPath !== filePath) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          modifiedInput: {
            file_path: unsanitizedPath
          }
        }
      }));
    }
  }

  // Handle Write/Edit tools
  if (['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
    let filePath = input.tool_input?.file_path || input.tool_input?.filePath || '';

    // Unsanitize path
    const unsanitizedPath = unsanitizePaths(filePath, state);

    // Validate - only allow writes within project
    const absPath = isAbsolute(unsanitizedPath) ? unsanitizedPath : resolve(state.projectRoot, unsanitizedPath);
    if (!absPath.startsWith(state.projectRoot) && !absPath.startsWith(join(HOME, '.claude'))) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: `Write access denied: Cannot write outside project directory`
        }
      }));
      process.exit(0);
    }

    // Store for PostToolUse
    state.pendingCommands[input.tool_use_id] = {
      tool: input.tool_name,
      originalPath: filePath,
      unsanitizedPath: unsanitizedPath
    };
    saveState(state);

    // Modify if needed
    if (unsanitizedPath !== filePath) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          modifiedInput: {
            file_path: unsanitizedPath
          }
        }
      }));
    }
  }

  // Handle Glob/Grep tools
  if (['Glob', 'Grep'].includes(input.tool_name)) {
    let path = input.tool_input?.path || '';

    if (path) {
      const unsanitizedPath = unsanitizePaths(path, state);

      // Validate
      if (!isPathAllowed(unsanitizedPath, state)) {
        console.log(JSON.stringify({
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: `Search access denied: ${path} is outside allowed boundaries`
          }
        }));
        process.exit(0);
      }

      state.pendingCommands[input.tool_use_id] = {
        tool: input.tool_name,
        originalPath: path,
        unsanitizedPath: unsanitizedPath
      };
      saveState(state);

      if (unsanitizedPath !== path) {
        console.log(JSON.stringify({
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            modifiedInput: {
              path: unsanitizedPath
            }
          }
        }));
      }
    }
  }

} catch (err) {
  // Silent failure - don't block on hook errors
  // console.error('Sandbox interceptor error:', err.message);
}
