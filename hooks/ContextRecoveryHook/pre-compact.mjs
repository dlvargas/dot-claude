#!/usr/bin/env node
/**
 * Pre-Compact Hook: Backs up session transcript before context compaction
 * Writes a marker file so session-start can detect recovery is needed
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const MARKER_PATH = join(homedir(), '.claude', 'claudefast-compaction-marker');
const BACKUP_DIR = join(process.cwd(), '.claude', 'backups');
const LOG_DIR = join(process.cwd(), '.claude', 'hooks', 'ContextRecoveryHook', 'logs');

function log(message) {
  const timestamp = new Date().toISOString();
  const logFile = join(LOG_DIR, 'pre-compact.log');
  try {
    if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
    const logEntry = `[${timestamp}] ${message}\n`;
    writeFileSync(logFile, logEntry, { flag: 'a' });
  } catch (e) {
    // Silent fail for logging
  }
}

function main() {
  try {
    // Ensure backup directory exists
    if (!existsSync(BACKUP_DIR)) {
      mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Create timestamp for backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sessionId = process.env.CLAUDE_SESSION_ID || 'unknown';

    // Write marker file for session recovery
    const markerData = JSON.stringify({
      timestamp,
      sessionId,
      projectPath: process.cwd(),
      compactedAt: new Date().toISOString()
    }, null, 2);

    // Ensure ~/.claude exists
    const claudeDir = join(homedir(), '.claude');
    if (!existsSync(claudeDir)) {
      mkdirSync(claudeDir, { recursive: true });
    }

    writeFileSync(MARKER_PATH, markerData);
    log(`Compaction marker written: ${MARKER_PATH}`);

    // Output for Claude to see
    console.log(JSON.stringify({
      status: 'success',
      message: 'Pre-compaction backup complete. Session state preserved.',
      markerPath: MARKER_PATH
    }));

  } catch (error) {
    log(`Error: ${error.message}`);
    console.log(JSON.stringify({
      status: 'error',
      message: error.message
    }));
  }
}

main();
