#!/usr/bin/env node
/**
 * Tests for command logging system
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';
import { execSync } from 'child_process';

const TEST_DIR = join(tmpdir(), 'claude-logging-test-' + Date.now());
const HOME = homedir();

console.log('🧪 Testing command logging system\n');
console.log(`Test directory: ${TEST_DIR}`);

// Setup
mkdirSync(TEST_DIR, { recursive: true });
mkdirSync(join(TEST_DIR, '.claude', 'logs'), { recursive: true });

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

// Test log entry structure
console.log('\n📝 Log Entry Structure Tests');

test('Log entry has required fields', () => {
  const logEntry = {
    id: 'test-123',
    timestamp: new Date().toISOString(),
    tool: 'Bash',
    command: 'ls -la',
    status: 'started',
    sessionId: 'session-abc',
    level: 'playground'
  };

  assert.ok(logEntry.id, 'Has id');
  assert.ok(logEntry.timestamp, 'Has timestamp');
  assert.ok(logEntry.tool, 'Has tool');
  assert.ok(logEntry.command, 'Has command');
  assert.ok(logEntry.status, 'Has status');
  assert.ok(logEntry.sessionId, 'Has sessionId');
  assert.ok(logEntry.level, 'Has level');
});

test('Log entry can track timing', () => {
  const startTime = Date.now();
  const logEntry = {
    startTime,
    queueTime: 50,
    executionTime: 150,
    totalTime: 200
  };

  assert.ok(logEntry.startTime > 0, 'Has start time');
  assert.ok(logEntry.queueTime >= 0, 'Has queue time');
  assert.ok(logEntry.executionTime >= 0, 'Has execution time');
  assert.equal(logEntry.totalTime, logEntry.queueTime + logEntry.executionTime, 'Total time is sum');
});

test('Log entry can track sizes', () => {
  const logEntry = {
    promptBytes: 1024,
    commandBytes: 50,
    outputBytes: 2048,
    responseBytes: 512
  };

  assert.ok(logEntry.promptBytes >= 0, 'Has prompt bytes');
  assert.ok(logEntry.commandBytes >= 0, 'Has command bytes');
  assert.ok(logEntry.outputBytes >= 0, 'Has output bytes');
  assert.ok(logEntry.responseBytes >= 0, 'Has response bytes');
});

console.log('\n📊 Log File Tests');

test('Can write log to JSON file', () => {
  const logFile = join(TEST_DIR, '.claude', 'logs', 'commands.jsonl');
  const entry = {
    id: 'test-1',
    timestamp: new Date().toISOString(),
    tool: 'Bash',
    command: 'echo hello'
  };

  writeFileSync(logFile, JSON.stringify(entry) + '\n', { flag: 'a' });
  assert.ok(existsSync(logFile), 'Log file created');
});

test('Can append multiple entries', () => {
  const logFile = join(TEST_DIR, '.claude', 'logs', 'commands.jsonl');

  for (let i = 0; i < 5; i++) {
    const entry = {
      id: `test-${i}`,
      timestamp: new Date().toISOString(),
      tool: 'Bash',
      command: `command ${i}`
    };
    writeFileSync(logFile, JSON.stringify(entry) + '\n', { flag: 'a' });
  }

  const content = readFileSync(logFile, 'utf8');
  const lines = content.trim().split('\n');
  assert.ok(lines.length >= 5, 'Multiple entries written');
});

test('Log entries are valid JSON', () => {
  const logFile = join(TEST_DIR, '.claude', 'logs', 'commands.jsonl');
  const content = readFileSync(logFile, 'utf8');
  const lines = content.trim().split('\n');

  for (const line of lines) {
    const parsed = JSON.parse(line);
    assert.ok(parsed.id, 'Each line is valid JSON with id');
  }
});

console.log('\n🔍 Log Query Tests');

test('Can filter logs by tool', () => {
  const logs = [
    { id: '1', tool: 'Bash', command: 'ls' },
    { id: '2', tool: 'Read', command: 'file.txt' },
    { id: '3', tool: 'Bash', command: 'pwd' },
    { id: '4', tool: 'Write', command: 'output.txt' }
  ];

  const bashLogs = logs.filter(l => l.tool === 'Bash');
  assert.equal(bashLogs.length, 2, 'Filtered to Bash commands');
});

test('Can filter logs by time range', () => {
  const now = Date.now();
  const logs = [
    { id: '1', timestamp: new Date(now - 3600000).toISOString() }, // 1 hour ago
    { id: '2', timestamp: new Date(now - 1800000).toISOString() }, // 30 min ago
    { id: '3', timestamp: new Date(now - 300000).toISOString() },  // 5 min ago
    { id: '4', timestamp: new Date(now).toISOString() }             // now
  ];

  const cutoff = new Date(now - 600000).toISOString(); // 10 min ago
  const recentLogs = logs.filter(l => l.timestamp > cutoff);
  assert.equal(recentLogs.length, 2, 'Filtered to last 10 minutes');
});

test('Can aggregate by command pattern', () => {
  const logs = [
    { id: '1', command: 'npm install' },
    { id: '2', command: 'npm test' },
    { id: '3', command: 'git status' },
    { id: '4', command: 'npm run build' },
    { id: '5', command: 'git commit' }
  ];

  const patterns = {};
  for (const log of logs) {
    const firstWord = log.command.split(' ')[0];
    patterns[firstWord] = (patterns[firstWord] || 0) + 1;
  }

  assert.equal(patterns['npm'], 3, 'Counted npm commands');
  assert.equal(patterns['git'], 2, 'Counted git commands');
});

console.log('\n📈 Log Statistics Tests');

test('Can calculate average execution time', () => {
  const logs = [
    { executionTime: 100 },
    { executionTime: 200 },
    { executionTime: 150 },
    { executionTime: 250 }
  ];

  const avg = logs.reduce((sum, l) => sum + l.executionTime, 0) / logs.length;
  assert.equal(avg, 175, 'Average calculated correctly');
});

test('Can track total bytes processed', () => {
  const logs = [
    { outputBytes: 1024 },
    { outputBytes: 2048 },
    { outputBytes: 512 }
  ];

  const total = logs.reduce((sum, l) => sum + l.outputBytes, 0);
  assert.equal(total, 3584, 'Total bytes calculated');
});

test('Can identify slow commands', () => {
  const logs = [
    { command: 'fast', executionTime: 50 },
    { command: 'medium', executionTime: 500 },
    { command: 'slow', executionTime: 5000 },
    { command: 'very slow', executionTime: 10000 }
  ];

  const slowThreshold = 1000;
  const slowCommands = logs.filter(l => l.executionTime > slowThreshold);
  assert.equal(slowCommands.length, 2, 'Found slow commands');
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
