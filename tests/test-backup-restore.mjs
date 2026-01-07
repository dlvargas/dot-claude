#!/usr/bin/env node
/**
 * Tests for backup and restore functionality
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { gzipSync, gunzipSync } from 'zlib';

const TEST_DIR = join(tmpdir(), 'claude-backup-restore-test-' + Date.now());

console.log('🧪 Testing backup and restore functionality\n');
console.log(`Test directory: ${TEST_DIR}`);

// Setup
mkdirSync(TEST_DIR, { recursive: true });
mkdirSync(join(TEST_DIR, '.claude', 'sessions'), { recursive: true });
mkdirSync(join(TEST_DIR, '.claude', 'diffs'), { recursive: true });

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${err.message}`);
    failed++;
  }
}

// Backup implementation for testing
class TestBackupManager {
  constructor(projectRoot, sessionId = 'test-session') {
    this.projectRoot = projectRoot;
    this.sessionId = sessionId;
    this.date = new Date().toISOString().split('T')[0];
    this.sessionDir = join(projectRoot, '.claude', 'sessions', `${this.date}_${sessionId}`);
    this.diffDir = join(projectRoot, '.claude', 'diffs', this.date);
    this.backups = [];
    this.backupSeq = 0;  // Sequence counter to avoid collisions

    mkdirSync(this.sessionDir, { recursive: true });
    mkdirSync(this.diffDir, { recursive: true });
  }

  backup(filePath) {
    if (!existsSync(filePath)) return null;

    const content = readFileSync(filePath);
    const timestamp = Date.now();
    this.backupSeq++;  // Increment sequence
    const safeName = filePath.replace(this.projectRoot, '').replace(/\//g, '_').replace(/^_/, '');
    const backupPath = join(this.sessionDir, `${safeName}.${timestamp}.${this.backupSeq}.bak`);

    // Compress if large
    if (content.length > 10000) {
      writeFileSync(backupPath + '.gz', gzipSync(content));
    } else {
      writeFileSync(backupPath, content);
    }

    const backup = {
      originalPath: filePath,
      backupPath: existsSync(backupPath + '.gz') ? backupPath + '.gz' : backupPath,
      timestamp: new Date().toISOString(),
      size: content.length,
      compressed: content.length > 10000
    };

    this.backups.push(backup);
    return backup;
  }

  restore(backup) {
    if (!existsSync(backup.backupPath)) {
      return { success: false, error: 'Backup not found' };
    }

    let content;
    if (backup.compressed) {
      content = gunzipSync(readFileSync(backup.backupPath));
    } else {
      content = readFileSync(backup.backupPath);
    }

    const targetDir = dirname(backup.originalPath);
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(backup.originalPath, content);

    return { success: true, restoredTo: backup.originalPath };
  }

  generateDiff(filePath, oldContent, newContent) {
    const safeName = filePath.replace(this.projectRoot, '').replace(/\//g, '_').replace(/^_/, '');
    const timestamp = Date.now();
    const diffPath = join(this.diffDir, `${safeName}.${timestamp}.diff`);

    // Simple diff format
    const diff = [
      `--- a/${safeName}`,
      `+++ b/${safeName}`,
      `@@ change @@`,
      ...oldContent.split('\n').map(l => '- ' + l),
      ...newContent.split('\n').map(l => '+ ' + l)
    ].join('\n');

    writeFileSync(diffPath, diff);
    return { diffPath, linesRemoved: oldContent.split('\n').length, linesAdded: newContent.split('\n').length };
  }
}

// Tests
console.log('\n📦 Basic Backup Tests');

test('Creates backup before modification', () => {
  const manager = new TestBackupManager(TEST_DIR, 'backup-test-1');
  const testFile = join(TEST_DIR, 'backup-basic.txt');
  writeFileSync(testFile, 'original content');

  const backup = manager.backup(testFile);

  assert.ok(backup, 'Backup created');
  assert.ok(existsSync(backup.backupPath), 'Backup file exists');
});

test('Backup preserves original content', () => {
  const manager = new TestBackupManager(TEST_DIR, 'backup-test-2');
  const testFile = join(TEST_DIR, 'backup-preserve.txt');
  const content = 'content to preserve exactly as-is';
  writeFileSync(testFile, content);

  const backup = manager.backup(testFile);
  const backupContent = readFileSync(backup.backupPath, 'utf8');

  assert.equal(backupContent, content, 'Content matches exactly');
});

test('Backup tracks metadata', () => {
  const manager = new TestBackupManager(TEST_DIR, 'backup-test-3');
  const testFile = join(TEST_DIR, 'backup-meta.txt');
  writeFileSync(testFile, 'metadata test');

  const backup = manager.backup(testFile);

  assert.ok(backup.originalPath, 'Has original path');
  assert.ok(backup.backupPath, 'Has backup path');
  assert.ok(backup.timestamp, 'Has timestamp');
  assert.ok(backup.size >= 0, 'Has size');
});

console.log('\n🗜️ Compression Tests');

test('Compresses large files', () => {
  const manager = new TestBackupManager(TEST_DIR, 'compress-test');
  const testFile = join(TEST_DIR, 'large-file.txt');
  const largeContent = 'x'.repeat(20000);
  writeFileSync(testFile, largeContent);

  const backup = manager.backup(testFile);

  assert.equal(backup.compressed, true, 'Marked as compressed');
  assert.ok(backup.backupPath.endsWith('.gz'), 'Has .gz extension');
});

test('Does not compress small files', () => {
  const manager = new TestBackupManager(TEST_DIR, 'no-compress-test');
  const testFile = join(TEST_DIR, 'small-file.txt');
  writeFileSync(testFile, 'small');

  const backup = manager.backup(testFile);

  assert.equal(backup.compressed, false, 'Not compressed');
  assert.ok(!backup.backupPath.endsWith('.gz'), 'No .gz extension');
});

console.log('\n♻️ Restore Tests');

test('Restores file from backup', () => {
  const manager = new TestBackupManager(TEST_DIR, 'restore-test-1');
  const testFile = join(TEST_DIR, 'restore-basic.txt');
  const originalContent = 'original content to restore';
  writeFileSync(testFile, originalContent);

  const backup = manager.backup(testFile);

  // Modify the file
  writeFileSync(testFile, 'modified content');
  assert.notEqual(readFileSync(testFile, 'utf8'), originalContent);

  // Restore
  const result = manager.restore(backup);

  assert.ok(result.success, 'Restore succeeded');
  assert.equal(readFileSync(testFile, 'utf8'), originalContent, 'Content restored');
});

test('Restores compressed backup', () => {
  const manager = new TestBackupManager(TEST_DIR, 'restore-compress-test');
  const testFile = join(TEST_DIR, 'restore-large.txt');
  const originalContent = 'y'.repeat(15000);
  writeFileSync(testFile, originalContent);

  const backup = manager.backup(testFile);

  // Modify
  writeFileSync(testFile, 'replaced');

  // Restore
  const result = manager.restore(backup);

  assert.ok(result.success, 'Restore succeeded');
  assert.equal(readFileSync(testFile, 'utf8'), originalContent, 'Large content restored');
});

test('Restore recreates deleted file', () => {
  const manager = new TestBackupManager(TEST_DIR, 'restore-deleted-test');
  const testFile = join(TEST_DIR, 'restore-deleted.txt');
  writeFileSync(testFile, 'will be deleted');

  const backup = manager.backup(testFile);

  // Delete the file
  rmSync(testFile);
  assert.ok(!existsSync(testFile), 'File deleted');

  // Restore
  const result = manager.restore(backup);

  assert.ok(result.success, 'Restore succeeded');
  assert.ok(existsSync(testFile), 'File recreated');
});

console.log('\n📝 Diff Tests');

test('Generates diff for changes', () => {
  const manager = new TestBackupManager(TEST_DIR, 'diff-test-1');
  const testFile = join(TEST_DIR, 'diff-basic.txt');

  const diff = manager.generateDiff(testFile, 'old line', 'new line');

  assert.ok(diff.diffPath, 'Has diff path');
  assert.ok(existsSync(diff.diffPath), 'Diff file exists');
});

test('Diff contains change markers', () => {
  const manager = new TestBackupManager(TEST_DIR, 'diff-test-2');
  const testFile = join(TEST_DIR, 'diff-markers.txt');

  const diff = manager.generateDiff(testFile, 'removed', 'added');
  const diffContent = readFileSync(diff.diffPath, 'utf8');

  assert.ok(diffContent.includes('---'), 'Has old file marker');
  assert.ok(diffContent.includes('+++'), 'Has new file marker');
  assert.ok(diffContent.includes('- '), 'Has removal marker');
  assert.ok(diffContent.includes('+ '), 'Has addition marker');
});

test('Diff tracks line counts', () => {
  const manager = new TestBackupManager(TEST_DIR, 'diff-test-3');
  const testFile = join(TEST_DIR, 'diff-counts.txt');

  const diff = manager.generateDiff(testFile, 'line1\nline2\nline3', 'new1\nnew2');

  assert.equal(diff.linesRemoved, 3, 'Counted removed lines');
  assert.equal(diff.linesAdded, 2, 'Counted added lines');
});

console.log('\n📁 Session Directory Tests');

test('Backups organized by session', () => {
  const session1 = new TestBackupManager(TEST_DIR, 'session-1');
  const session2 = new TestBackupManager(TEST_DIR, 'session-2');

  assert.ok(session1.sessionDir.includes('session-1'), 'Session 1 has own dir');
  assert.ok(session2.sessionDir.includes('session-2'), 'Session 2 has own dir');
  assert.notEqual(session1.sessionDir, session2.sessionDir, 'Different directories');
});

test('Session directory includes date', () => {
  const manager = new TestBackupManager(TEST_DIR, 'date-test');
  const today = new Date().toISOString().split('T')[0];

  assert.ok(manager.sessionDir.includes(today), 'Session dir includes date');
});

console.log('\n🔄 Multiple Backup Tests');

test('Can backup same file multiple times', () => {
  const manager = new TestBackupManager(TEST_DIR, 'multi-backup-test');
  const testFile = join(TEST_DIR, 'multi-backup.txt');

  writeFileSync(testFile, 'version 1');
  const backup1 = manager.backup(testFile);

  writeFileSync(testFile, 'version 2');
  const backup2 = manager.backup(testFile);

  // Backup paths may be same if timestamp collision, but backups array should have 2
  assert.equal(manager.backups.length, 2, 'Both backups tracked');
  assert.ok(backup1.backupPath, 'Backup 1 has path');
  assert.ok(backup2.backupPath, 'Backup 2 has path');
});

test('Can restore to any backup version', () => {
  const manager = new TestBackupManager(TEST_DIR, 'version-restore-test');
  const testFile = join(TEST_DIR, 'version-restore.txt');

  writeFileSync(testFile, 'version 1');
  const backup1 = manager.backup(testFile);

  writeFileSync(testFile, 'version 2');
  const backup2 = manager.backup(testFile);

  writeFileSync(testFile, 'version 3');

  // Verify backup1 contains version 1
  const backup1Content = backup1.compressed
    ? gunzipSync(readFileSync(backup1.backupPath)).toString()
    : readFileSync(backup1.backupPath, 'utf8');
  assert.equal(backup1Content, 'version 1', 'Backup 1 has v1 content');

  // Verify backup2 contains version 2
  const backup2Content = backup2.compressed
    ? gunzipSync(readFileSync(backup2.backupPath)).toString()
    : readFileSync(backup2.backupPath, 'utf8');
  assert.equal(backup2Content, 'version 2', 'Backup 2 has v2 content');

  // Restore from backup1 works
  manager.restore(backup1);
  assert.equal(readFileSync(testFile, 'utf8'), 'version 1', 'Restored to v1');
});

// Cleanup
console.log('\n🧹 Cleanup');
try {
  rmSync(TEST_DIR, { recursive: true });
  console.log('  Cleaned up test directory');
} catch {}

// Summary
console.log('\n' + '═'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(40));

process.exit(failed > 0 ? 1 : 0);
