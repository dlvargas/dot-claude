#!/usr/bin/env node
/**
 * Backup Manager - Handles file backups, soft-delete, diffs, and restore
 *
 * Features:
 * - Pre-change file snapshots
 * - Session-organized backup directories
 * - Unified diff generation for all changes
 * - Soft-delete with trash management
 * - Full restore capability
 */

import {
  readFileSync, writeFileSync, existsSync, mkdirSync,
  copyFileSync, unlinkSync, readdirSync, statSync, renameSync
} from 'fs';
import { execSync } from 'child_process';
import { dirname, basename, join, relative, extname } from 'path';
import { createHash } from 'crypto';
import { gzipSync, gunzipSync } from 'zlib';

const SESSION_ID = process.env.CLAUDE_SESSION_ID || Date.now().toString(36);
const PROJECT_ROOT = process.cwd();

export class BackupManager {
  constructor(projectRoot = PROJECT_ROOT, sessionId = SESSION_ID) {
    this.projectRoot = projectRoot;
    this.sessionId = sessionId;
    this.date = new Date().toISOString().split('T')[0];

    // Directories
    this.sessionDir = join(projectRoot, '.claude', 'sessions', `${this.date}_${sessionId}`);
    this.diffDir = join(projectRoot, '.claude', 'diffs', this.date);
    this.trashDir = join(projectRoot, '.claude', 'trash', sessionId);
    this.metaFile = join(this.sessionDir, 'metadata.json');

    // State
    this.metadata = this.loadMetadata();
    this.backupCount = {};

    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.sessionDir, this.diffDir, this.trashDir].forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  loadMetadata() {
    try {
      if (existsSync(this.metaFile)) {
        return JSON.parse(readFileSync(this.metaFile, 'utf8'));
      }
    } catch {}
    return {
      sessionId: this.sessionId,
      startedAt: new Date().toISOString(),
      backups: [],
      diffs: [],
      deletions: [],
      restores: []
    };
  }

  saveMetadata() {
    writeFileSync(this.metaFile, JSON.stringify(this.metadata, null, 2));
  }

  // Generate backup filename
  getBackupPath(filePath) {
    const rel = relative(this.projectRoot, filePath);
    const safeName = rel.replace(/\//g, '_');
    const seq = (this.backupCount[filePath] || 0) + 1;
    this.backupCount[filePath] = seq;

    const timestamp = Date.now();
    return join(this.sessionDir, `${safeName}.${timestamp}.${seq}.bak`);
  }

  // Backup a file before modification
  backupFile(filePath) {
    if (!existsSync(filePath)) {
      return null; // New file, no backup needed
    }

    try {
      const backupPath = this.getBackupPath(filePath);
      const content = readFileSync(filePath);

      // Compress if large
      if (content.length > 10000) {
        writeFileSync(backupPath + '.gz', gzipSync(content));
      } else {
        copyFileSync(filePath, backupPath);
      }

      const backup = {
        originalPath: filePath,
        backupPath: existsSync(backupPath + '.gz') ? backupPath + '.gz' : backupPath,
        timestamp: new Date().toISOString(),
        size: content.length,
        hash: createHash('md5').update(content).digest('hex'),
        compressed: content.length > 10000
      };

      this.metadata.backups.push(backup);
      this.saveMetadata();

      return backup;
    } catch (err) {
      console.error(`Backup failed for ${filePath}:`, err.message);
      return null;
    }
  }

  // Generate and save diff
  generateDiff(filePath, oldContent, newContent) {
    const rel = relative(this.projectRoot, filePath);
    const safeName = rel.replace(/\//g, '_');
    const timestamp = Date.now();
    const diffPath = join(this.diffDir, `${safeName}.${timestamp}.diff`);

    try {
      // Use diff command if available
      const oldFile = join(this.sessionDir, '.tmp_old');
      const newFile = join(this.sessionDir, '.tmp_new');

      writeFileSync(oldFile, oldContent || '');
      writeFileSync(newFile, newContent || '');

      let diff;
      try {
        diff = execSync(`diff -u "${oldFile}" "${newFile}"`, { encoding: 'utf8' });
      } catch (e) {
        // diff returns non-zero when files differ
        diff = e.stdout || '';
      }

      // Clean up temp files
      try { unlinkSync(oldFile); } catch {}
      try { unlinkSync(newFile); } catch {}

      if (diff) {
        // Add header
        const header = `--- a/${rel}\n+++ b/${rel}\n`;
        const fullDiff = header + diff.split('\n').slice(2).join('\n');

        writeFileSync(diffPath, fullDiff);

        const diffRecord = {
          filePath,
          diffPath,
          timestamp: new Date().toISOString(),
          linesAdded: (fullDiff.match(/^\+[^+]/gm) || []).length,
          linesRemoved: (fullDiff.match(/^-[^-]/gm) || []).length
        };

        this.metadata.diffs.push(diffRecord);
        this.saveMetadata();

        return diffRecord;
      }
    } catch (err) {
      console.error(`Diff generation failed for ${filePath}:`, err.message);
    }

    return null;
  }

  // Soft delete - move to trash instead of permanent delete
  softDelete(filePath) {
    if (!existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }

    try {
      // Preserve directory structure in trash
      const rel = relative(this.projectRoot, filePath);
      const trashPath = join(this.trashDir, rel);
      const trashParent = dirname(trashPath);

      if (!existsSync(trashParent)) {
        mkdirSync(trashParent, { recursive: true });
      }

      // Handle name collision
      let finalTrashPath = trashPath;
      let counter = 1;
      while (existsSync(finalTrashPath)) {
        const ext = extname(trashPath);
        const base = basename(trashPath, ext);
        finalTrashPath = join(trashParent, `${base}.${counter}${ext}`);
        counter++;
      }

      // Move to trash
      renameSync(filePath, finalTrashPath);

      const deletion = {
        originalPath: filePath,
        trashPath: finalTrashPath,
        deletedAt: new Date().toISOString(),
        canRestore: true,
        restoreCommand: `mv "${finalTrashPath}" "${filePath}"`
      };

      this.metadata.deletions.push(deletion);
      this.saveMetadata();

      return { success: true, deletion };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Restore from trash
  restore(trashPath) {
    const deletion = this.metadata.deletions.find(d => d.trashPath === trashPath);

    if (!deletion) {
      return { success: false, error: 'Deletion record not found' };
    }

    if (!existsSync(trashPath)) {
      return { success: false, error: 'Trash file not found' };
    }

    try {
      const targetDir = dirname(deletion.originalPath);
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      renameSync(trashPath, deletion.originalPath);

      deletion.canRestore = false;
      deletion.restoredAt = new Date().toISOString();

      this.metadata.restores.push({
        from: trashPath,
        to: deletion.originalPath,
        restoredAt: new Date().toISOString()
      });

      this.saveMetadata();

      return { success: true, restoredTo: deletion.originalPath };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Restore from backup
  restoreFromBackup(backupPath) {
    const backup = this.metadata.backups.find(b => b.backupPath === backupPath);

    if (!backup) {
      return { success: false, error: 'Backup record not found' };
    }

    try {
      let content;
      if (backup.compressed) {
        content = gunzipSync(readFileSync(backupPath));
      } else {
        content = readFileSync(backupPath);
      }

      // Backup current before restore
      if (existsSync(backup.originalPath)) {
        this.backupFile(backup.originalPath);
      }

      const targetDir = dirname(backup.originalPath);
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      writeFileSync(backup.originalPath, content);

      this.metadata.restores.push({
        from: backupPath,
        to: backup.originalPath,
        restoredAt: new Date().toISOString(),
        type: 'backup'
      });

      this.saveMetadata();

      return { success: true, restoredTo: backup.originalPath };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // List all backups for a file
  getBackupsForFile(filePath) {
    return this.metadata.backups.filter(b => b.originalPath === filePath);
  }

  // List all deleted files that can be restored
  getRestorableFiles() {
    return this.metadata.deletions.filter(d => d.canRestore);
  }

  // Get session summary
  getSummary() {
    return {
      sessionId: this.sessionId,
      date: this.date,
      backupCount: this.metadata.backups.length,
      diffCount: this.metadata.diffs.length,
      deletionCount: this.metadata.deletions.length,
      restoreCount: this.metadata.restores.length,
      directories: {
        session: this.sessionDir,
        diffs: this.diffDir,
        trash: this.trashDir
      }
    };
  }

  // Clean old sessions (keep last N days)
  cleanOldSessions(keepDays = 7) {
    const sessionsRoot = join(this.projectRoot, '.claude', 'sessions');
    const cutoff = Date.now() - (keepDays * 24 * 60 * 60 * 1000);

    if (!existsSync(sessionsRoot)) return;

    const sessions = readdirSync(sessionsRoot);
    for (const session of sessions) {
      const sessionPath = join(sessionsRoot, session);
      try {
        const stat = statSync(sessionPath);
        if (stat.mtime.getTime() < cutoff) {
          // Move to archive or delete
          console.log(`Cleaning old session: ${session}`);
        }
      } catch {}
    }
  }
}

// CLI interface
if (process.argv[1].endsWith('backup-manager.mjs')) {
  const args = process.argv.slice(2);
  const command = args[0];
  const manager = new BackupManager();

  switch (command) {
    case 'backup':
      const backupResult = manager.backupFile(args[1]);
      console.log(JSON.stringify(backupResult, null, 2));
      break;

    case 'soft-delete':
      const deleteResult = manager.softDelete(args[1]);
      console.log(JSON.stringify(deleteResult, null, 2));
      break;

    case 'restore':
      const restoreResult = manager.restore(args[1]);
      console.log(JSON.stringify(restoreResult, null, 2));
      break;

    case 'restore-backup':
      const restoreBackupResult = manager.restoreFromBackup(args[1]);
      console.log(JSON.stringify(restoreBackupResult, null, 2));
      break;

    case 'list-restorable':
      console.log(JSON.stringify(manager.getRestorableFiles(), null, 2));
      break;

    case 'summary':
      console.log(JSON.stringify(manager.getSummary(), null, 2));
      break;

    default:
      console.log(`Usage: backup-manager.mjs <command> [args]
Commands:
  backup <file>           Backup a file before modification
  soft-delete <file>      Move file to trash (can restore)
  restore <trash-path>    Restore from trash
  restore-backup <path>   Restore from backup
  list-restorable         List files that can be restored
  summary                 Show session summary`);
  }
}

export default BackupManager;
