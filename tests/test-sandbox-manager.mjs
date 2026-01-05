#!/usr/bin/env node
/**
 * Tests for sandbox-manager.mjs
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';

// Import the module we're testing
const TEST_DIR = join(tmpdir(), 'claude-sandbox-test-' + Date.now());
const HOME = homedir();
const USERNAME = process.env.USER || 'user';

// Setup
mkdirSync(TEST_DIR, { recursive: true });
mkdirSync(join(TEST_DIR, 'src'), { recursive: true });
writeFileSync(join(TEST_DIR, 'src', 'test.js'), 'console.log("test");');

console.log('🧪 Testing sandbox-manager.mjs\n');
console.log(`Test directory: ${TEST_DIR}`);

// Dynamic import since it's ESM
const { SandboxManager } = await import('../scripts/sandbox-manager.mjs');

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

// Tests
console.log('\n📁 Path Sanitization Tests');

test('Project path becomes $PROJECT', () => {
  const manager = new SandboxManager(TEST_DIR);
  const result = manager.sanitizePath(join(TEST_DIR, 'src', 'test.js'));
  assert.equal(result, '$PROJECT/src/test.js');
});

test('Project root becomes $PROJECT', () => {
  const manager = new SandboxManager(TEST_DIR);
  const result = manager.sanitizePath(TEST_DIR);
  assert.equal(result, '$PROJECT');
});

test('Home directory path sanitized', () => {
  const manager = new SandboxManager(TEST_DIR);
  const homePath = join(HOME, '.config', 'test');
  const result = manager.sanitizePath(homePath);
  assert.equal(result, '/home/user/.config/test');
});

test('System executable paths preserved', () => {
  const manager = new SandboxManager(TEST_DIR);
  const result = manager.sanitizePath('/usr/bin/node');
  assert.equal(result, '/usr/bin/node');
});

test('External paths get hashed', () => {
  const manager = new SandboxManager(TEST_DIR);
  const result = manager.sanitizePath('/some/external/path/file.txt');
  assert.match(result, /^\[EXT:[a-f0-9]+\]\/file\.txt$/);
});

console.log('\n🔄 Reverse Sanitization Tests');

test('$PROJECT path unsanitizes correctly', () => {
  const manager = new SandboxManager(TEST_DIR);
  const result = manager.unsanitizePath('$PROJECT/src/test.js');
  assert.equal(result, join(TEST_DIR, 'src', 'test.js'));
});

test('/home/user path unsanitizes correctly', () => {
  const manager = new SandboxManager(TEST_DIR);
  const result = manager.unsanitizePath('/home/user/.config/test');
  assert.equal(result, join(HOME, '.config', 'test'));
});

test('Mapping is consistent (sanitize then unsanitize)', () => {
  const manager = new SandboxManager(TEST_DIR);
  const original = join(TEST_DIR, 'src', 'test.js');
  const sanitized = manager.sanitizePath(original);
  const unsanitized = manager.unsanitizePath(sanitized);
  assert.equal(unsanitized, original);
});

test('External path mapping is reversible', () => {
  const manager = new SandboxManager(TEST_DIR);
  const original = '/some/random/external/file.txt';
  const sanitized = manager.sanitizePath(original);
  const unsanitized = manager.unsanitizePath(sanitized);
  assert.equal(unsanitized, original);
});

console.log('\n👤 Username Sanitization Tests');

test('Username in text is sanitized', () => {
  const manager = new SandboxManager(TEST_DIR);
  const text = `User ${USERNAME} logged in from /Users/${USERNAME}/docs`;
  const result = manager.sanitizeUsername(text);
  assert.ok(!result.includes(USERNAME), 'Username should be removed');
  assert.ok(result.includes('user'), 'Should contain generic "user"');
});

test('Home path in text is sanitized', () => {
  const manager = new SandboxManager(TEST_DIR);
  const text = `File at /Users/${USERNAME}/Documents/file.txt`;
  const result = manager.sanitizeUsername(text);
  assert.ok(result.includes('/home/user/Documents/file.txt'), 'Should use /home/user with path preserved');
  assert.ok(!result.includes(USERNAME), 'Should not contain username');
});

console.log('\n📝 Text Sanitization Tests');

test('Full text sanitization works', () => {
  const manager = new SandboxManager(TEST_DIR);
  const text = `Working in ${TEST_DIR}/src with user ${USERNAME}`;
  const result = manager.sanitizeText(text);
  assert.ok(result.includes('$PROJECT'), 'Should have $PROJECT');
  assert.ok(!result.includes(TEST_DIR), 'Should not have real path');
});

console.log('\n🌍 Environment Sanitization Tests');

test('Sensitive env vars are hidden', () => {
  const manager = new SandboxManager(TEST_DIR);
  const env = {
    HOME: '/Users/realuser',
    USER: 'realuser',
    PATH: '/usr/bin',
    AWS_SECRET: 'supersecret',
    API_KEY: 'mykey'
  };
  const result = manager.sanitizeEnv(env);
  assert.equal(result.HOME, '/home/user');
  assert.equal(result.USER, 'user');
  assert.ok(!result.AWS_SECRET, 'AWS_SECRET should be hidden');
  assert.ok(!result.API_KEY, 'API_KEY should be hidden');
  assert.ok(result.PATH, 'PATH should be kept');
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
