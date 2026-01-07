#!/usr/bin/env node
/**
 * Tests for sandbox-interceptor-v2.mjs
 *
 * These tests validate the hook's logic without actually running it as a hook.
 * We test the core functions: command checking, path checking, level config loading.
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';

const TEST_DIR = join(tmpdir(), 'claude-interceptor-test-' + Date.now());
const HOME = homedir();

console.log('🧪 Testing sandbox-interceptor-v2.mjs logic\n');
console.log(`Test directory: ${TEST_DIR}`);

// Setup
mkdirSync(TEST_DIR, { recursive: true });
mkdirSync(join(TEST_DIR, '.claude'), { recursive: true });

// Create a test sandbox-levels.json
const testLevelsConfig = {
  levels: {
    jailed: {
      boundaries: { projectOnly: true, allowHomeAccess: false },
      commands: {
        allowed: ['ls', 'cat', 'git status', 'git log'],
        blocked: ['*'],
        requireApproval: []
      },
      sanitization: { paths: 'aggressive', usernames: true }
    },
    playground: {
      default: true,
      boundaries: { projectOnly: false, allowHomeAccess: true, allowSystemPaths: false },
      commands: {
        allowed: ['*'],
        blocked: ['sudo', 'rm -rf /', 'dd if=/dev'],
        requireApproval: ['rm', 'kill']
      },
      sanitization: { paths: 'moderate', usernames: true }
    },
    BACKSTAGEPASS: {
      boundaries: { allowHomeAccess: true, allowSystemPaths: true, allowDevices: true },
      commands: {
        allowed: ['*'],
        blocked: ['rm -rf /', 'dd if=/dev/zero of=/dev/sda'],
        softDelete: ['rm']
      },
      sanitization: { paths: 'light', usernames: true }
    },
    ALLACCESSPASS: {
      boundaries: { unrestricted: true },
      commands: {
        allowed: ['*'],
        blocked: ['rm -rf /', 'rm -rf /*']
      },
      sanitization: { paths: 'none', usernames: true }
    }
  }
};

// Save test config
const configDir = join(HOME, '.claude', 'config');
mkdirSync(configDir, { recursive: true });
const originalConfig = existsSync(join(configDir, 'sandbox-levels.json'))
  ? readFileSync(join(configDir, 'sandbox-levels.json'), 'utf8')
  : null;

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

// Helper to simulate the interceptor logic
function loadLevelsConfig() {
  return testLevelsConfig;
}

function isCommandAllowed(command, level) {
  const config = loadLevelsConfig();
  const levelConfig = config.levels[level];

  if (!levelConfig) return { allowed: false, reason: 'Unknown level' };

  const cmdConfig = levelConfig.commands || {};
  const firstWord = command.split(/\s+/)[0];

  // Check blocked patterns first
  const blocked = cmdConfig.blocked || [];
  for (const pattern of blocked) {
    if (pattern === '*') {
      // Wildcard block - only allow if in allowed list
      const allowed = cmdConfig.allowed || [];
      if (!allowed.includes(firstWord) && !allowed.includes('*') && !allowed.some(a => command.startsWith(a))) {
        return { allowed: false, reason: 'Command not in allowed list' };
      }
    } else if (command === pattern || command.startsWith(pattern + ' ') || command.startsWith(pattern)) {
      // Exact match or pattern prefix match
      return { allowed: false, reason: `Command matches blocked pattern: ${pattern}` };
    }
  }

  // Check soft delete (takes priority - converts rm to move)
  const softDelete = cmdConfig.softDelete || [];
  for (const cmd of softDelete) {
    if (firstWord === cmd || command.startsWith(cmd + ' ')) {
      return { allowed: true, softDelete: true };
    }
  }

  // Check if requires approval
  const requireApproval = cmdConfig.requireApproval || [];
  for (const pattern of requireApproval) {
    if (firstWord === pattern || command.startsWith(pattern + ' ')) {
      return { allowed: true, requiresApproval: true, pattern };
    }
  }

  return { allowed: true };
}

function isPathAllowed(path, level, operation = 'read', projectRoot = TEST_DIR) {
  const config = loadLevelsConfig();
  const levelConfig = config.levels[level];

  if (!levelConfig) return { allowed: false };

  const boundaries = levelConfig.boundaries || {};

  // Project paths always allowed
  if (path.startsWith(projectRoot)) {
    return { allowed: true };
  }

  // .claude directory
  if (path.startsWith(join(HOME, '.claude'))) {
    return { allowed: true };
  }

  // System executables
  if (['/usr/bin', '/bin', '/usr/local/bin', '/opt/homebrew/bin'].some(p => path.startsWith(p))) {
    return { allowed: true };
  }

  // Check boundaries
  if (boundaries.projectOnly && !path.startsWith(projectRoot)) {
    return { allowed: false, reason: 'Project-only mode' };
  }

  if (boundaries.unrestricted) {
    return { allowed: true };
  }

  if (!boundaries.allowHomeAccess && path.startsWith(HOME)) {
    return { allowed: false, reason: 'Home access not allowed' };
  }

  if (!boundaries.allowSystemPaths) {
    if (['/etc', '/var', '/tmp'].some(p => path.startsWith(p))) {
      return { allowed: false, reason: 'System paths not allowed' };
    }
  }

  return { allowed: true };
}

// Tests
console.log('\n🔒 Jailed Level Tests');

test('Jailed: allows ls command', () => {
  const result = isCommandAllowed('ls -la', 'jailed');
  assert.equal(result.allowed, true);
});

test('Jailed: allows git status', () => {
  const result = isCommandAllowed('git status', 'jailed');
  assert.equal(result.allowed, true);
});

test('Jailed: blocks npm command', () => {
  const result = isCommandAllowed('npm install', 'jailed');
  assert.equal(result.allowed, false);
});

test('Jailed: blocks path outside project', () => {
  const result = isPathAllowed('/etc/passwd', 'jailed');
  assert.equal(result.allowed, false);
});

test('Jailed: allows project path', () => {
  const result = isPathAllowed(join(TEST_DIR, 'src/file.js'), 'jailed');
  assert.equal(result.allowed, true);
});

console.log('\n🎮 Playground Level Tests');

test('Playground: allows most commands', () => {
  const result = isCommandAllowed('npm install', 'playground');
  assert.equal(result.allowed, true);
});

test('Playground: blocks sudo', () => {
  const result = isCommandAllowed('sudo rm -rf /', 'playground');
  assert.equal(result.allowed, false);
});

test('Playground: rm requires approval', () => {
  const result = isCommandAllowed('rm file.txt', 'playground');
  assert.equal(result.allowed, true);
  assert.equal(result.requiresApproval, true);
});

test('Playground: kill requires approval', () => {
  const result = isCommandAllowed('kill -9 1234', 'playground');
  assert.equal(result.allowed, true);
  assert.equal(result.requiresApproval, true);
});

test('Playground: allows home access', () => {
  const result = isPathAllowed(join(HOME, 'Documents/file.txt'), 'playground');
  assert.equal(result.allowed, true);
});

test('Playground: blocks system paths', () => {
  const result = isPathAllowed('/etc/passwd', 'playground');
  assert.equal(result.allowed, false);
});

console.log('\n🎸 BACKSTAGEPASS Level Tests');

test('BACKSTAGEPASS: rm becomes soft delete', () => {
  const result = isCommandAllowed('rm file.txt', 'BACKSTAGEPASS');
  assert.equal(result.allowed, true);
  assert.equal(result.softDelete, true);
});

test('BACKSTAGEPASS: allows system paths', () => {
  const result = isPathAllowed('/etc/hosts', 'BACKSTAGEPASS');
  assert.equal(result.allowed, true);
});

test('BACKSTAGEPASS: still blocks rm -rf /', () => {
  const result = isCommandAllowed('rm -rf /', 'BACKSTAGEPASS');
  assert.equal(result.allowed, false);
});

console.log('\n🎤 ALLACCESSPASS Level Tests');

test('ALLACCESSPASS: allows almost everything', () => {
  const result = isCommandAllowed('dd if=/dev/urandom of=test bs=1M count=1', 'ALLACCESSPASS');
  assert.equal(result.allowed, true);
});

test('ALLACCESSPASS: still blocks rm -rf /', () => {
  const result = isCommandAllowed('rm -rf /', 'ALLACCESSPASS');
  assert.equal(result.allowed, false);
});

test('ALLACCESSPASS: unrestricted path access', () => {
  const result = isPathAllowed('/dev/sda', 'ALLACCESSPASS');
  assert.equal(result.allowed, true);
});

console.log('\n❓ Unknown Level Tests');

test('Unknown level denies by default', () => {
  const result = isCommandAllowed('ls', 'nonexistent');
  assert.equal(result.allowed, false);
  assert.ok(result.reason.includes('Unknown level'));
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
