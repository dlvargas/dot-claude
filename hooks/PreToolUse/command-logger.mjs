#!/usr/bin/env node
/**
 * PreToolUse hook that logs all commands to SQLite database
 *
 * Records timing, size metrics, and prepares for output capture.
 * Works with PostToolUse/command-logger-post.mjs to complete the log entry.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

const DB_PATH = process.env.CLAUDE_LOG_DB || `${process.env.HOME}/.claude/logs/commands.db`;
const PENDING_DIR = join(tmpdir(), 'claude-command-logs');

function ensureDb() {
  if (!existsSync(DB_PATH)) {
    // Try to initialize
    const initScript = `${process.env.HOME}/.claude/scripts/init-logging-db.mjs`;
    if (existsSync(initScript)) {
      try {
        execSync(`node "${initScript}" "${DB_PATH}"`, { stdio: 'pipe' });
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

function hashCommand(cmd) {
  // Normalize command for grouping similar commands
  const normalized = cmd
    .replace(/["'][^"']*["']/g, '""')  // Replace quoted strings
    .replace(/\d+/g, 'N')               // Replace numbers
    .replace(/\s+/g, ' ')               // Normalize whitespace
    .trim();
  return createHash('md5').update(normalized).digest('hex').slice(0, 12);
}

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function insertLog(data) {
  const sql = `
    INSERT INTO command_log (
      session_id, tool_use_id, time_inferred, time_submitted,
      tool_name, command, command_hash, working_directory,
      prompt_size_bytes, command_size_bytes
    ) VALUES (
      ${escapeSQL(data.session_id)},
      ${escapeSQL(data.tool_use_id)},
      ${escapeSQL(data.time_inferred)},
      ${escapeSQL(data.time_submitted)},
      ${escapeSQL(data.tool_name)},
      ${escapeSQL(data.command)},
      ${escapeSQL(data.command_hash)},
      ${escapeSQL(data.cwd)},
      ${data.prompt_size_bytes || 'NULL'},
      ${data.command_size_bytes || 'NULL'}
    );
  `;

  try {
    execSync(`sqlite3 "${DB_PATH}" "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return true;
  } catch (error) {
    return false;
  }
}

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

  if (!ensureDb()) {
    process.exit(0); // Silently skip if DB not available
  }

  const now = new Date().toISOString();
  const command = input.tool_input?.command || JSON.stringify(input.tool_input);

  const logData = {
    session_id: input.session_id,
    tool_use_id: input.tool_use_id,
    time_inferred: now, // Best approximation
    time_submitted: now,
    tool_name: input.tool_name,
    command: command,
    command_hash: hashCommand(command),
    cwd: input.cwd,
    prompt_size_bytes: Buffer.byteLength(JSON.stringify(input), 'utf8'),
    command_size_bytes: Buffer.byteLength(command, 'utf8')
  };

  insertLog(logData);

  // Save pending log for PostToolUse to complete
  if (!existsSync(PENDING_DIR)) {
    mkdirSync(PENDING_DIR, { recursive: true });
  }

  writeFileSync(
    join(PENDING_DIR, `${input.tool_use_id}.json`),
    JSON.stringify({
      ...logData,
      time_started: now
    })
  );

} catch {
  // Silent failure - don't interrupt workflow
}
