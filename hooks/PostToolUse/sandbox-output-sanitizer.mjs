#!/usr/bin/env node
/**
 * PostToolUse Sandbox Output Sanitizer
 *
 * Sanitizes ALL output from tools before Claude sees it:
 * 1. Replaces real paths with sanitized versions
 * 2. Masks usernames
 * 3. Sanitizes external file references
 * 4. Maintains consistent mappings for reverse translation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join, relative, basename, isAbsolute } from 'path';
import { homedir } from 'os';
import { tmpdir } from 'os';
import { createHash } from 'crypto';

const HOME = homedir();
const USERNAME = process.env.USER || process.env.USERNAME || 'user';
const PROJECT_ROOT = process.cwd();
const SANDBOX_STATE = join(tmpdir(), 'claude-sandbox-state.json');

// Load sandbox state
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

function hashPath(path) {
  return createHash('md5').update(path).digest('hex').slice(0, 8);
}

function isInProject(path, projectRoot) {
  const absPath = isAbsolute(path) ? path : resolve(projectRoot, path);
  return absPath.startsWith(projectRoot);
}

function sanitizePath(path, state) {
  if (!path) return path;

  const absPath = isAbsolute(path) ? path : resolve(state.projectRoot, path);

  // Already mapped?
  if (state.mappings.pathToSafe[absPath]) {
    return state.mappings.pathToSafe[absPath];
  }

  let safePath;

  // Within project - make relative with $PROJECT
  if (absPath.startsWith(state.projectRoot)) {
    const relPath = relative(state.projectRoot, absPath);
    safePath = relPath === '' ? '$PROJECT' : `$PROJECT/${relPath}`;
  }
  // Home directory
  else if (absPath.startsWith(HOME)) {
    const relPath = relative(HOME, absPath);
    safePath = `/home/user/${relPath}`;
  }
  // System paths - keep as is but note them
  else if (absPath.startsWith('/usr') || absPath.startsWith('/bin') ||
           absPath.startsWith('/sbin') || absPath.startsWith('/opt') ||
           absPath.startsWith('/etc')) {
    safePath = absPath; // System paths visible
  }
  // External paths - hash and map
  else {
    const hash = hashPath(absPath);
    const name = basename(absPath);
    safePath = `[EXT:${hash}]/${name}`;
  }

  // Store mapping
  state.mappings.pathToSafe[absPath] = safePath;
  state.mappings.safeToPath[safePath] = absPath;

  return safePath;
}

function sanitizeOutput(text, state) {
  if (!text || typeof text !== 'string') return text;

  let result = text;

  // Replace username in various patterns
  const usernamePatterns = [
    new RegExp(`/Users/${USERNAME}`, 'g'),
    new RegExp(`/home/${USERNAME}`, 'g'),
    new RegExp(`\\b${USERNAME}\\b`, 'g'),
  ];

  for (const pattern of usernamePatterns) {
    result = result.replace(pattern, (match) => {
      if (match.startsWith('/Users/')) return '/home/user';
      if (match.startsWith('/home/')) return '/home/user';
      return 'user';
    });
  }

  // Replace project root with $PROJECT
  const projectPattern = new RegExp(state.projectRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  result = result.replace(projectPattern, '$PROJECT');

  // Find and replace absolute paths
  const pathPattern = /(\/[\w./-]+)/g;
  result = result.replace(pathPattern, (match) => {
    // Skip URLs
    if (match.includes('://')) return match;
    // Skip if already sanitized
    if (match.includes('$PROJECT') || match.includes('[EXT:')) return match;
    // Skip short system paths that are likely commands
    if (match.length < 10 && (match.startsWith('/bin') || match.startsWith('/usr'))) return match;

    return sanitizePath(match, state);
  });

  // Sanitize environment variable values that might leak
  result = result.replace(/HOME=[^\s]+/g, 'HOME=/home/user');
  result = result.replace(/USER=[^\s]+/g, 'USER=user');
  result = result.replace(/LOGNAME=[^\s]+/g, 'LOGNAME=user');

  // Sanitize process info that might show username
  result = result.replace(new RegExp(`\\s${USERNAME}\\s`, 'g'), ' user ');

  // Sanitize git config that might leak
  result = result.replace(/user\.name\s*=\s*[^\n]+/gi, 'user.name = [REDACTED]');
  result = result.replace(/user\.email\s*=\s*[^\n]+/gi, 'user.email = [REDACTED]');

  return result;
}

function sanitizeLogOutput(text, state) {
  if (!text) return text;

  let result = sanitizeOutput(text, state);

  // Additional log-specific sanitization

  // Timestamps - make relative or remove
  result = result.replace(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}[.\d]*Z?/g, '[TIMESTAMP]');

  // PIDs
  result = result.replace(/\bpid[=:\s]+\d+/gi, 'pid=[PID]');
  result = result.replace(/\bPID[=:\s]+\d+/g, 'PID=[PID]');

  // Port numbers (keep them visible but note sensitive ones)
  // result = result.replace(/:\d{4,5}\b/g, ':[PORT]');

  // Session IDs that might be sensitive
  result = result.replace(/session[_-]?id[=:\s]+[a-zA-Z0-9-]+/gi, 'session_id=[SESSION]');

  // UUIDs in logs
  result = result.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[UUID]');

  return result;
}

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));
  const state = loadState();

  // Get tool result
  const toolResult = input.tool_result;
  if (!toolResult) {
    process.exit(0);
  }

  // Determine if this is a log-heavy output
  const isLogOutput = input.tool_name === 'Bash' &&
    (input.tool_input?.command?.includes('log') ||
     input.tool_input?.command?.includes('journalctl') ||
     input.tool_input?.command?.includes('dmesg'));

  // Sanitize based on content type
  let sanitizedResult;
  if (typeof toolResult === 'string') {
    sanitizedResult = isLogOutput
      ? sanitizeLogOutput(toolResult, state)
      : sanitizeOutput(toolResult, state);
  } else if (typeof toolResult === 'object') {
    // Handle structured results
    sanitizedResult = JSON.parse(
      isLogOutput
        ? sanitizeLogOutput(JSON.stringify(toolResult), state)
        : sanitizeOutput(JSON.stringify(toolResult), state)
    );
  } else {
    sanitizedResult = toolResult;
  }

  // Save updated mappings
  saveState(state);

  // Clean up pending command
  if (state.pendingCommands[input.tool_use_id]) {
    delete state.pendingCommands[input.tool_use_id];
    saveState(state);
  }

  // Check if anything was sanitized
  const originalStr = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);
  const sanitizedStr = typeof sanitizedResult === 'string' ? sanitizedResult : JSON.stringify(sanitizedResult);

  if (originalStr !== sanitizedStr) {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        sandboxSanitization: {
          applied: true,
          originalLength: originalStr.length,
          sanitizedLength: sanitizedStr.length,
          mappingsCreated: Object.keys(state.mappings.pathToSafe).length
        },
        modifiedResult: sanitizedResult
      }
    }));
  }

} catch (err) {
  // Silent failure
  // console.error('Sandbox output sanitizer error:', err.message);
}
