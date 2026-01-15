#!/usr/bin/env node
/**
 * PostToolUse hook that tracks file changes for atomic commits
 *
 * Maintains a session-local list of changed files and suggests
 * commits at logical breakpoints (after completing a feature/fix).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, basename, join } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';

const SESSION_FILE = join(tmpdir(), 'claude-git-session.json');

function loadSession() {
  try {
    if (existsSync(SESSION_FILE)) {
      return JSON.parse(readFileSync(SESSION_FILE, 'utf8'));
    }
  } catch {}
  return { files: [], startTime: Date.now(), commitCount: 0 };
}

function saveSession(session) {
  try {
    writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
  } catch {}
}

function getGitRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function hasUncommittedChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    return status.length > 0;
  } catch {
    return false;
  }
}

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

  // Only track file-modifying tools
  if (!['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
    process.exit(0);
  }

  const gitRoot = getGitRoot();
  if (!gitRoot) {
    process.exit(0); // Not a git repo
  }

  const filePath = input.tool_input?.file_path || input.tool_input?.filePath;
  if (!filePath) {
    process.exit(0);
  }

  // Load and update session
  const session = loadSession();

  // Add file if not already tracked
  if (!session.files.includes(filePath)) {
    session.files.push(filePath);
  }

  saveSession(session);

  // Suggest commit at certain thresholds
  const fileCount = session.files.length;
  const shouldSuggestCommit =
    fileCount >= 5 || // Many files changed
    (fileCount >= 3 && Date.now() - session.startTime > 10 * 60 * 1000); // 3+ files after 10 min

  if (shouldSuggestCommit && hasUncommittedChanges()) {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        gitReminder: {
          filesChanged: fileCount,
          files: session.files.slice(0, 5), // First 5 files
          moreFiles: Math.max(0, fileCount - 5),
          message: `${fileCount} files modified this session. Consider an atomic commit.`,
          suggestion: "Use /commit or ask Claude to commit these changes"
        }
      }
    }));
  }
} catch {
  // Silent failure
}
