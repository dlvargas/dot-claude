#!/usr/bin/env node
/**
 * PostToolUse hook that completes command log entries
 *
 * Records output size, execution time, exit code, and timing metrics.
 */

import { readFileSync, unlinkSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';

const DB_PATH = process.env.CLAUDE_LOG_DB || `${process.env.HOME}/.claude/logs/commands.db`;
const PENDING_DIR = join(tmpdir(), 'claude-command-logs');

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function updateLog(toolUseId, data) {
  const sql = `
    UPDATE command_log SET
      time_completed = ${escapeSQL(data.time_completed)},
      time_response_received = ${escapeSQL(data.time_response_received)},
      duration_execution_ms = ${data.duration_execution_ms || 'NULL'},
      duration_total_ms = ${data.duration_total_ms || 'NULL'},
      output_size_bytes = ${data.output_size_bytes || 'NULL'},
      response_size_bytes = ${data.response_size_bytes || 'NULL'},
      exit_code = ${data.exit_code ?? 'NULL'},
      success = ${data.success ? 1 : 0},
      error_message = ${escapeSQL(data.error_message)},
      output_preview = ${escapeSQL(data.output_preview)}
    WHERE tool_use_id = ${escapeSQL(toolUseId)};
  `;

  try {
    execSync(`sqlite3 "${DB_PATH}" "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch {
    // Silent failure
  }
}

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

  if (!existsSync(DB_PATH)) {
    process.exit(0);
  }

  const toolUseId = input.tool_use_id;
  const pendingFile = join(PENDING_DIR, `${toolUseId}.json`);

  const now = new Date().toISOString();
  const nowMs = Date.now();

  let startTime = nowMs;
  if (existsSync(pendingFile)) {
    try {
      const pending = JSON.parse(readFileSync(pendingFile, 'utf8'));
      startTime = new Date(pending.time_started).getTime();
      unlinkSync(pendingFile); // Clean up
    } catch {}
  }

  // Extract output info from tool result
  const toolOutput = input.tool_result?.content || input.tool_result || '';
  const outputStr = typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput);

  const updateData = {
    time_completed: now,
    time_response_received: now,
    duration_execution_ms: nowMs - startTime,
    duration_total_ms: nowMs - startTime,
    output_size_bytes: Buffer.byteLength(outputStr, 'utf8'),
    response_size_bytes: Buffer.byteLength(JSON.stringify(input), 'utf8'),
    exit_code: input.tool_result?.exit_code,
    success: !input.tool_result?.error && input.tool_result?.exit_code !== 1,
    error_message: input.tool_result?.error || null,
    output_preview: outputStr.slice(0, 500)
  };

  updateLog(toolUseId, updateData);

} catch {
  // Silent failure
}
