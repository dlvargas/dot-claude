#!/usr/bin/env node
/**
 * PreToolUse hook that auto-approves Bash commands targeting ~/.claude/
 *
 * This allows the dot-claude project to manage the global Claude config
 * without requiring manual approval for each Bash operation.
 */

import { readFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';

const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

// Only process Bash tool calls
if (input.tool_name !== 'Bash') {
  // Let other tools pass through to normal permission handling
  console.log(JSON.stringify({ decision: "continue" }));
  process.exit(0);
}

const command = input.tool_input?.command || '';
const claudeDir = resolve(homedir(), '.claude');

// Patterns that indicate the command operates on ~/.claude/
const claudeDirPatterns = [
  new RegExp(`${claudeDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),  // Absolute path
  /~\/\.claude/,  // Tilde notation
  /\$HOME\/\.claude/,  // $HOME variable
];

// Check if command targets ~/.claude/
const targetsClaudeDir = claudeDirPatterns.some(pattern => pattern.test(command));

if (targetsClaudeDir) {
  // Auto-approve commands that operate on ~/.claude/
  console.log(JSON.stringify({
    decision: "approve",
    reason: "Command targets ~/.claude/ (auto-approved for dot-claude project)"
  }));
} else {
  // Let normal permission handling decide
  console.log(JSON.stringify({ decision: "continue" }));
}
