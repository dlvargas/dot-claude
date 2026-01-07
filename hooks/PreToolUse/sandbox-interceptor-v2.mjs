#!/usr/bin/env node
/**
 * Sandbox Interceptor v2 - Multi-level security with backup integration
 *
 * Implements the tiered sandbox system:
 * - jailed, sandbox, playground, asuser, asuserremote, asroot, asrootremote
 * - BACKSTAGEPASS, ALLACCESSPASS
 *
 * All levels include:
 * - Path sanitization (level-dependent)
 * - Backup before changes
 * - Diff tracking
 * - Soft-delete for destructive operations
 * - Git verification for user+ levels
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join, relative, isAbsolute, basename } from 'path';
import { homedir } from 'os';
import { tmpdir } from 'os';
import { execSync } from 'child_process';
import { createHash } from 'crypto';

const HOME = homedir();
const USERNAME = process.env.USER || process.env.USERNAME || 'user';
const PROJECT_ROOT = process.cwd();
const STATE_FILE = join(tmpdir(), 'claude-sandbox-v2-state.json');
const LEVELS_FILE = join(HOME, '.claude', 'config', 'sandbox-levels.json');
const CURRENT_LEVEL_FILE = join(PROJECT_ROOT, '.claude', 'sandbox-level');

// Load sandbox levels configuration
function loadLevelsConfig() {
  try {
    if (existsSync(LEVELS_FILE)) {
      return JSON.parse(readFileSync(LEVELS_FILE, 'utf8'));
    }
  } catch {}
  return { levels: { playground: { commands: { allowed: ['*'], blocked: [] } } } };
}

// Get current sandbox level
function getCurrentLevel() {
  // Check env var first
  if (process.env.CLAUDE_SANDBOX_LEVEL) {
    return process.env.CLAUDE_SANDBOX_LEVEL;
  }

  // Check project-level setting
  try {
    if (existsSync(CURRENT_LEVEL_FILE)) {
      return readFileSync(CURRENT_LEVEL_FILE, 'utf8').trim();
    }
  } catch {}

  return 'playground'; // Default
}

// Load or create state
function loadState() {
  try {
    if (existsSync(STATE_FILE)) {
      return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    }
  } catch {}
  return {
    level: getCurrentLevel(),
    projectRoot: PROJECT_ROOT,
    mappings: { pathToSafe: {}, safeToPath: {} },
    pendingCommands: {},
    gitVerified: false,
    sessionId: Date.now().toString(36)
  };
}

function saveState(state) {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch {}
}

// Git verification
function verifyGit(requirements) {
  try {
    // Check if git repo
    execSync('git rev-parse --git-dir', { cwd: PROJECT_ROOT, stdio: 'pipe' });

    if (requirements.requireBranchSync) {
      execSync('git fetch', { cwd: PROJECT_ROOT, stdio: 'pipe' });
      const local = execSync('git rev-parse HEAD', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
      const remote = execSync('git rev-parse @{u}', { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
      const base = execSync('git merge-base HEAD @{u}', { cwd: PROJECT_ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();

      if (local !== remote && local !== base) {
        return { passed: false, error: 'Branch not synced with remote' };
      }
    }

    if (requirements.requireCleanTree) {
      const status = execSync('git status --porcelain', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
      if (status) {
        return { passed: false, error: 'Uncommitted changes exist' };
      }
    }

    return { passed: true };
  } catch (err) {
    return { passed: false, error: err.message };
  }
}

// Backup file before modification
function backupFile(filePath, sessionId) {
  if (!existsSync(filePath)) return null;

  try {
    const date = new Date().toISOString().split('T')[0];
    const backupDir = join(PROJECT_ROOT, '.claude', 'sessions', `${date}_${sessionId}`);
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true });
    }

    const rel = relative(PROJECT_ROOT, filePath);
    const safeName = rel.replace(/\//g, '_');
    const seq = Date.now();
    const backupPath = join(backupDir, `${safeName}.${seq}.bak`);

    const content = readFileSync(filePath);
    writeFileSync(backupPath, content);

    return { originalPath: filePath, backupPath, timestamp: new Date().toISOString() };
  } catch {
    return null;
  }
}

// Path sanitization based on level
function sanitizePath(path, level, state) {
  const levelConfig = loadLevelsConfig().levels[level] || {};
  const sanitization = levelConfig.sanitization || {};

  if (sanitization.paths === 'none') {
    return path;
  }

  const absPath = isAbsolute(path) ? path : resolve(PROJECT_ROOT, path);

  // Check cache
  if (state.mappings.pathToSafe[absPath]) {
    return state.mappings.pathToSafe[absPath];
  }

  let safePath;

  // Project paths
  if (absPath.startsWith(PROJECT_ROOT)) {
    const relPath = relative(PROJECT_ROOT, absPath);
    safePath = relPath === '' ? '$PROJECT' : `$PROJECT/${relPath}`;
  }
  // Home paths
  else if (absPath.startsWith(HOME)) {
    if (sanitization.paths === 'aggressive') {
      const relPath = relative(HOME, absPath);
      safePath = `/home/user/${relPath}`;
    } else {
      safePath = absPath.replace(new RegExp(`^${HOME}`), '/home/user');
    }
  }
  // System paths
  else if (['/usr', '/bin', '/sbin', '/opt'].some(p => absPath.startsWith(p))) {
    safePath = absPath; // Keep system paths visible
  }
  // External paths
  else {
    if (sanitization.paths === 'aggressive' || sanitization.paths === 'moderate') {
      const hash = createHash('md5').update(absPath).digest('hex').slice(0, 8);
      safePath = `[EXT:${hash}]/${basename(absPath)}`;
    } else {
      safePath = absPath;
    }
  }

  state.mappings.pathToSafe[absPath] = safePath;
  state.mappings.safeToPath[safePath] = absPath;

  return safePath;
}

// Reverse sanitization for execution
function unsanitizePath(safePath, state) {
  if (state.mappings.safeToPath[safePath]) {
    return state.mappings.safeToPath[safePath];
  }

  if (safePath.startsWith('$PROJECT')) {
    return safePath.replace('$PROJECT', PROJECT_ROOT);
  }

  if (safePath.startsWith('/home/user')) {
    return safePath.replace('/home/user', HOME);
  }

  return safePath;
}

// Check if command is allowed at current level
function isCommandAllowed(command, level) {
  const config = loadLevelsConfig();
  const levelConfig = config.levels[level];

  if (!levelConfig) return { allowed: false, reason: 'Unknown level' };

  const cmdConfig = levelConfig.commands || {};

  // Check blocked patterns first
  const blocked = cmdConfig.blocked || [];
  for (const pattern of blocked) {
    if (pattern === '*') {
      // Check if in allowed list
      const allowed = cmdConfig.allowed || [];
      const firstWord = command.split(/\s+/)[0];
      if (!allowed.includes(firstWord) && !allowed.includes('*')) {
        return { allowed: false, reason: 'Command not in allowed list' };
      }
    } else if (command.includes(pattern) || command.startsWith(pattern.split(' ')[0])) {
      return { allowed: false, reason: `Command matches blocked pattern: ${pattern}` };
    }
  }

  // Check if requires approval
  const requireApproval = cmdConfig.requireApproval || [];
  for (const pattern of requireApproval) {
    if (command.includes(pattern) || command.startsWith(pattern.split(' ')[0])) {
      return { allowed: true, requiresApproval: true, pattern };
    }
  }

  // Check soft delete
  const softDelete = cmdConfig.softDelete || [];
  for (const cmd of softDelete) {
    if (command.startsWith(cmd)) {
      return { allowed: true, softDelete: true };
    }
  }

  return { allowed: true };
}

// Check if path access is allowed at current level
function isPathAllowed(path, level, operation = 'read') {
  const config = loadLevelsConfig();
  const levelConfig = config.levels[level];

  if (!levelConfig) return { allowed: false };

  const boundaries = levelConfig.boundaries || {};

  const absPath = isAbsolute(path) ? path : resolve(PROJECT_ROOT, path);

  // Project paths always allowed
  if (absPath.startsWith(PROJECT_ROOT)) {
    return { allowed: true };
  }

  // .claude directory
  if (absPath.startsWith(join(HOME, '.claude'))) {
    return { allowed: true };
  }

  // System executables (for execution)
  if (['/usr/bin', '/bin', '/usr/local/bin', '/opt/homebrew/bin'].some(p => absPath.startsWith(p))) {
    return { allowed: true };
  }

  // Check boundaries
  if (boundaries.projectOnly && !absPath.startsWith(PROJECT_ROOT)) {
    return { allowed: false, reason: 'Project-only mode' };
  }

  if (!boundaries.allowHomeAccess && absPath.startsWith(HOME)) {
    return { allowed: false, reason: 'Home access not allowed' };
  }

  if (!boundaries.allowSystemPaths) {
    if (['/etc', '/var', '/tmp'].some(p => absPath.startsWith(p))) {
      return { allowed: false, reason: 'System paths not allowed' };
    }
  }

  if (!boundaries.allowDevices && absPath.startsWith('/dev')) {
    return { allowed: false, reason: 'Device access not allowed' };
  }

  if (operation === 'write' && !boundaries.allowSystemWrite) {
    if (!absPath.startsWith(PROJECT_ROOT) && !absPath.startsWith(HOME)) {
      return { allowed: false, reason: 'System write not allowed' };
    }
  }

  return { allowed: true };
}

// Main hook logic
try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));
  const state = loadState();
  const level = getCurrentLevel();
  const config = loadLevelsConfig();
  const levelConfig = config.levels[level] || {};

  state.level = level;

  // Git verification for levels that require it
  if (levelConfig.gitRequired && !state.gitVerified) {
    const gitCheck = verifyGit(levelConfig.gitVerification || {});
    if (!gitCheck.passed) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: `Git verification failed: ${gitCheck.error}. Level '${level}' requires a valid git repository.`
        }
      }));
      process.exit(0);
    }
    state.gitVerified = true;
  }

  // Handle Bash tool
  if (input.tool_name === 'Bash') {
    let command = input.tool_input?.command || '';

    // Check command permissions
    const cmdCheck = isCommandAllowed(command, level);

    if (!cmdCheck.allowed) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: `Command blocked by sandbox level '${level}': ${cmdCheck.reason}`
        }
      }));
      process.exit(0);
    }

    // Handle soft delete
    if (cmdCheck.softDelete && command.match(/^rm\s/)) {
      // Convert rm to soft delete
      const files = command.replace(/^rm\s+(-[rf]+\s+)?/, '').split(/\s+/).filter(f => f);
      const softDeleteDir = join(PROJECT_ROOT, '.claude', 'trash', state.sessionId);

      if (!existsSync(softDeleteDir)) {
        mkdirSync(softDeleteDir, { recursive: true });
      }

      // Modify command to move instead of delete
      const moveCommands = files.map(f => `mv "${f}" "${softDeleteDir}/"`).join(' && ');
      const modifiedCommand = moveCommands;

      state.pendingCommands[input.tool_use_id] = {
        original: command,
        modified: modifiedCommand,
        softDelete: true,
        files,
        trashDir: softDeleteDir
      };

      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          modifiedInput: { command: modifiedCommand },
          sandboxInfo: {
            level,
            action: 'soft-delete',
            originalCommand: command,
            trashedTo: softDeleteDir
          }
        }
      }));

      saveState(state);
      process.exit(0);
    }

    // Handle approval required
    if (cmdCheck.requiresApproval) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "ask",
          permissionDecisionReason: `Destructive command requires approval at level '${level}': ${command}`
        }
      }));
      process.exit(0);
    }

    // Unsanitize paths in command for execution
    let unsanitizedCommand = command;
    unsanitizedCommand = unsanitizedCommand.replace(/\$PROJECT/g, PROJECT_ROOT);
    unsanitizedCommand = unsanitizedCommand.replace(/\/home\/user/g, HOME);

    // Store pending
    state.pendingCommands[input.tool_use_id] = {
      original: command,
      unsanitized: unsanitizedCommand,
      level
    };

    saveState(state);

    if (unsanitizedCommand !== command) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          modifiedInput: { command: unsanitizedCommand },
          sandboxInfo: { level }
        }
      }));
    }
  }

  // Handle Read tool
  if (input.tool_name === 'Read') {
    const filePath = input.tool_input?.file_path || '';
    const unsanitizedPath = unsanitizePath(filePath, state);
    const pathCheck = isPathAllowed(unsanitizedPath, level, 'read');

    if (!pathCheck.allowed) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: `Read access denied by sandbox level '${level}': ${pathCheck.reason}`
        }
      }));
      process.exit(0);
    }

    if (unsanitizedPath !== filePath) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          modifiedInput: { file_path: unsanitizedPath }
        }
      }));
    }
  }

  // Handle Write/Edit tools
  if (['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
    const filePath = input.tool_input?.file_path || input.tool_input?.filePath || '';
    const unsanitizedPath = unsanitizePath(filePath, state);
    const pathCheck = isPathAllowed(unsanitizedPath, level, 'write');

    if (!pathCheck.allowed) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: `Write access denied by sandbox level '${level}': ${pathCheck.reason}`
        }
      }));
      process.exit(0);
    }

    // Backup before modification
    if (levelConfig.backup?.beforeAnyChange) {
      const backup = backupFile(unsanitizedPath, state.sessionId);
      if (backup) {
        state.pendingCommands[input.tool_use_id] = {
          tool: input.tool_name,
          backup,
          originalPath: filePath,
          unsanitizedPath
        };
      }
    }

    saveState(state);

    if (unsanitizedPath !== filePath) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          modifiedInput: { file_path: unsanitizedPath },
          sandboxInfo: { level, backedUp: true }
        }
      }));
    }
  }

} catch (err) {
  // Silent failure
  // console.error('Sandbox interceptor error:', err.message);
}
