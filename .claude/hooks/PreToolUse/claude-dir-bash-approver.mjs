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

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

  // Only process Bash tool calls (matcher should handle this, but double-check)
  if (input.tool_name !== 'Bash') {
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
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
        permissionDecisionReason: "Command targets ~/.claude/ (auto-approved for dot-claude project)"
      },
      suppressOutput: true
    }));
  }
  // If not targeting ~/.claude/, exit silently with code 0 to let normal permission handling decide
} catch {
  // On any error, exit with no output to let normal permission handling proceed
}
