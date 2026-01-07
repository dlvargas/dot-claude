#!/usr/bin/env node
/**
 * Tests for Project Initialization Protocol
 * Validates security level selection, feature selection, and configuration
 */

import { strict as assert } from 'assert';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const PROJECT_ROOT = process.cwd();

console.log('🧪 Testing Project Initialization Protocol\n');

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

// ==================== CLAUDE.MD TESTS ====================
console.log('📋 CLAUDE.md Structure Tests');

let claudeMd;
try {
  const claudeMdPath = join(PROJECT_ROOT, 'CLAUDE.md');
  claudeMd = readFileSync(claudeMdPath, 'utf8');
} catch (e) {
  console.error('Failed to load CLAUDE.md:', e.message);
  process.exit(1);
}

test('CLAUDE.md contains initialization protocol section', () => {
  assert.ok(claudeMd.includes('Project Initialization Protocol'),
    'Should have Project Initialization Protocol section');
});

test('CLAUDE.md specifies asuser as default', () => {
  assert.ok(claudeMd.includes('Default Privilege Level: `asuser`') ||
    claudeMd.includes('default security level is **asuser**'),
    'Should specify asuser as default');
});

// ==================== SECURITY LEVEL TESTS ====================
console.log('\n🔒 Security Level Selection Tests');

const expectedLevels = [
  'jailed', 'sandbox', 'playground', 'asuser', 'asuserremote',
  'asroot', 'asrootremote', 'BACKSTAGEPASS', 'ALLACCESSPASS', 'INSERTDIETYHERE'
];

test('CLAUDE.md documents all 10 security levels', () => {
  for (const level of expectedLevels) {
    assert.ok(claudeMd.includes(level), `Should document ${level} level`);
  }
});

test('Security levels have emoji indicators', () => {
  const emojis = ['🔒', '📦', '🎮', '👤', '🔑', '🎸', '🎤', '⚡'];
  let emojiCount = 0;
  for (const emoji of emojis) {
    if (claudeMd.includes(emoji)) emojiCount++;
  }
  assert.ok(emojiCount >= 6, `Should have multiple level emojis, found ${emojiCount}`);
});

test('Security levels have risk ratings', () => {
  const risks = ['Minimal', 'Low', 'Moderate', 'High', 'Critical', 'Extreme', 'Maximum', 'Divine'];
  let riskCount = 0;
  for (const risk of risks) {
    if (claudeMd.includes(risk)) riskCount++;
  }
  assert.ok(riskCount >= 5, `Should document risk ratings, found ${riskCount}`);
});

// ==================== FEATURE SELECTION TESTS ====================
console.log('\n⚙️ Feature Selection Tests');

const expectedFeatures = [
  'Logging',
  'Auto Linting',
  'Auto Backups',
  'Auto Git Commits',
  'Diff Tracking',
  'Director Mode',
  'Swarm Mode',
  'Path Sanitization',
  '100% and 100%',
  'Structured SDLC'
];

test('CLAUDE.md documents all autonomous features', () => {
  for (const feature of expectedFeatures) {
    assert.ok(claudeMd.includes(feature), `Should document ${feature} feature`);
  }
});

test('Features have default states indicated', () => {
  // Check for checkmarks or on/off indicators
  assert.ok(claudeMd.includes('✅') || claudeMd.includes('On'),
    'Should indicate default on states');
  assert.ok(claudeMd.includes('⬜') || claudeMd.includes('Off'),
    'Should indicate default off states');
});

test('Swarm Mode is off by default', () => {
  // Find the Swarm Mode line and verify it shows off
  const swarmLine = claudeMd.split('\n').find(line =>
    line.includes('Swarm Mode') && (line.includes('⬜') || line.includes('Off'))
  );
  assert.ok(swarmLine, 'Swarm Mode should be off by default');
});

test('Director Mode is on by default', () => {
  const directorLine = claudeMd.split('\n').find(line =>
    line.includes('Director Mode') && (line.includes('✅') || line.includes('On'))
  );
  assert.ok(directorLine, 'Director Mode should be on by default');
});

test('100% and 100% feature is off by default', () => {
  const hundredLine = claudeMd.split('\n').find(line =>
    line.includes('100% and 100%') && (line.includes('⬜') || line.includes('Off'))
  );
  assert.ok(hundredLine, '100% and 100% should be off by default');
});

test('Structured SDLC is off by default', () => {
  const sdlcLine = claudeMd.split('\n').find(line =>
    line.includes('Structured SDLC') && (line.includes('⬜') || line.includes('Off'))
  );
  assert.ok(sdlcLine, 'Structured SDLC should be off by default');
});

// ==================== PHASED SDLC WORKFLOW TESTS ====================
console.log('\n📊 Phased SDLC Workflow Tests');

test('CLAUDE.md documents phased SDLC workflow', () => {
  assert.ok(claudeMd.includes('Phased SDLC Workflow'),
    'Should have Phased SDLC Workflow section');
});

test('CLAUDE.md documents all 4 phases', () => {
  assert.ok(claudeMd.includes('Phase 1: Discovery'), 'Should have Phase 1: Discovery');
  assert.ok(claudeMd.includes('Phase 2: Design'), 'Should have Phase 2: Design');
  assert.ok(claudeMd.includes('Phase 3: Development'), 'Should have Phase 3: Development');
  assert.ok(claudeMd.includes('Phase 4: Delivery'), 'Should have Phase 4: Delivery');
});

test('Phase 1 includes required artifacts', () => {
  assert.ok(claudeMd.includes('Requirements Document'), 'Should include Requirements Document');
  assert.ok(claudeMd.includes('Entity Relationship Diagram') || claudeMd.includes('ERD'),
    'Should include ERD');
  assert.ok(claudeMd.includes('User Stories'), 'Should include User Stories');
  assert.ok(claudeMd.includes('Process Map'), 'Should include Process Map');
  assert.ok(claudeMd.includes('Solution Design'), 'Should include Solution Design');
});

test('Phase 2 includes SA/LD/BSA verification', () => {
  assert.ok(claudeMd.includes('SA') || claudeMd.includes('Solutions Architect'),
    'Should include SA verification');
  assert.ok(claudeMd.includes('LD') || claudeMd.includes('Lead Developer'),
    'Should include LD verification');
  assert.ok(claudeMd.includes('BSA') || claudeMd.includes('Business Systems'),
    'Should include BSA verification');
});

test('Workflow includes sign-off gates', () => {
  assert.ok(claudeMd.includes('Sign-Off') || claudeMd.includes('SIGN OFF'),
    'Should document sign-off gates');
});

test('Phase 4 documents 100% and 100% enforcement', () => {
  assert.ok(claudeMd.includes('100% and 100% Enforcement') ||
    (claudeMd.includes('100%') && claudeMd.includes('Enforcement')),
    'Should document 100% enforcement');
});

test('Workflow requires human merge for main branch', () => {
  assert.ok(claudeMd.includes('Human Merge') || claudeMd.includes('HUMAN MERGE'),
    'Should require human merge');
});

// ==================== PARALLEL CLAUDE MODELS TESTS ====================
console.log('\n🔀 Parallel Claude Working Models Tests');

test('CLAUDE.md documents parallel working models', () => {
  assert.ok(claudeMd.includes('Parallel Claude Working Models'),
    'Should have Parallel Claude Working Models section');
});

test('Documents Peer Review Pipeline model', () => {
  assert.ok(claudeMd.includes('Peer Review Pipeline'),
    'Should document Peer Review Pipeline');
});

test('Documents Adversarial Testing model', () => {
  assert.ok(claudeMd.includes('Adversarial Testing'),
    'Should document Adversarial Testing');
});

test('Documents Parallel Specialists model', () => {
  assert.ok(claudeMd.includes('Parallel Specialists'),
    'Should document Parallel Specialists');
});

test('Documents Evolution/Iteration model', () => {
  assert.ok(claudeMd.includes('Evolution/Iteration') || claudeMd.includes('Evolution'),
    'Should document Evolution/Iteration');
});

test('Documents Debate/Consensus model', () => {
  assert.ok(claudeMd.includes('Debate/Consensus') || claudeMd.includes('Debate'),
    'Should document Debate/Consensus');
});

test('Documents Red Team/Blue Team model', () => {
  assert.ok(claudeMd.includes('Red Team') || claudeMd.includes('Blue Team'),
    'Should document Red Team/Blue Team');
});

test('Documents Assembly Line model', () => {
  assert.ok(claudeMd.includes('Assembly Line'),
    'Should document Assembly Line');
});

test('Includes model selection guide', () => {
  assert.ok(claudeMd.includes('Choosing the Right Model') ||
    claudeMd.includes('Recommended Model'),
    'Should include model selection guidance');
});

// ==================== INIT-AUTONOMOUS COMMAND TESTS ====================
console.log('\n📜 Init-Autonomous Command Tests');

let initCommand;
try {
  const commandPath = join(PROJECT_ROOT, 'commands', 'init-autonomous.md');
  initCommand = readFileSync(commandPath, 'utf8');
} catch (e) {
  console.error('Failed to load init-autonomous.md:', e.message);
  initCommand = '';
}

if (initCommand) {
  test('Init command has security level question', () => {
    assert.ok(initCommand.includes('Security Level') || initCommand.includes('security level'),
      'Should ask about security level');
  });

  test('Init command has feature selection question', () => {
    assert.ok(initCommand.includes('Features') || initCommand.includes('features'),
      'Should ask about features');
  });

  test('Init command has orchestration question', () => {
    assert.ok(initCommand.includes('Orchestration') || initCommand.includes('Director') || initCommand.includes('Swarm'),
      'Should ask about orchestration modes');
  });

  test('Init command references asuser as recommended', () => {
    assert.ok(initCommand.includes('asuser') &&
      (initCommand.includes('Recommended') || initCommand.includes('DEFAULT') || initCommand.includes('Default')),
      'Should recommend asuser');
  });

  test('Init command includes all security levels', () => {
    for (const level of expectedLevels) {
      assert.ok(initCommand.includes(level), `Should include ${level} level option`);
    }
  });

  test('Init command documents swarm manager domains', () => {
    assert.ok(initCommand.includes('Manager') && initCommand.includes('Domain'),
      'Should document swarm manager domains');
  });
}

// ==================== SWARM ARCHITECTURE CONFIG TESTS ====================
console.log('\n🏗️ Swarm Architecture Default Config Tests');

let swarmConfig;
try {
  const configPath = join(PROJECT_ROOT, 'config', 'swarm-architecture.json');
  swarmConfig = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (e) {
  console.log('  ⚠️  Could not load swarm-architecture.json, skipping config tests');
  swarmConfig = null;
}

if (swarmConfig) {
  test('Swarm config has defaultConfiguration', () => {
    assert.ok(swarmConfig.defaultConfiguration, 'Should have defaultConfiguration');
  });

  test('Swarm config default security is asuser', () => {
    assert.equal(swarmConfig.defaultConfiguration.securityLevel, 'asuser',
      'Default security should be asuser');
  });

  test('Swarm config has enabledByDefault domains', () => {
    assert.ok(Array.isArray(swarmConfig.defaultConfiguration.enabledByDefault),
      'Should have enabledByDefault array');
    assert.ok(swarmConfig.defaultConfiguration.enabledByDefault.length >= 3,
      'Should have at least 3 default domains');
  });

  test('Swarm config has optionalDomains', () => {
    assert.ok(Array.isArray(swarmConfig.defaultConfiguration.optionalDomains),
      'Should have optionalDomains array');
  });

  test('Core domains are enabled by default', () => {
    const defaults = swarmConfig.defaultConfiguration.enabledByDefault;
    assert.ok(defaults.includes('discovery_requirements'), 'Discovery should be default');
    assert.ok(defaults.includes('architecture'), 'Architecture should be default');
    assert.ok(defaults.includes('quality_assurance'), 'QA should be default');
  });
}

// ==================== SANDBOX LEVELS CONFIG TESTS ====================
console.log('\n📊 Sandbox Levels Config Tests');

let sandboxConfig;
try {
  const configPath = join(PROJECT_ROOT, 'config', 'sandbox-levels.json');
  sandboxConfig = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (e) {
  try {
    const configPath = join(HOME, '.claude', 'config', 'sandbox-levels.json');
    sandboxConfig = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (e2) {
    console.log('  ⚠️  Could not load sandbox-levels.json, skipping');
    sandboxConfig = null;
  }
}

if (sandboxConfig) {
  test('Sandbox config has all 10 levels', () => {
    const levels = Object.keys(sandboxConfig.levels);
    assert.equal(levels.length, 10, `Expected 10 levels, got ${levels.length}`);
  });

  test('Asuser level exists and is properly configured', () => {
    const asuser = sandboxConfig.levels.asuser;
    assert.ok(asuser, 'Asuser level should exist');
    assert.equal(asuser.gitRequired, true, 'Asuser should require git');
    assert.equal(asuser.risk, 'moderate', 'Asuser should have moderate risk');
  });

  test('INSERTDIETYHERE is omnipotent', () => {
    const deity = sandboxConfig.levels.INSERTDIETYHERE;
    assert.ok(deity, 'INSERTDIETYHERE should exist');
    assert.equal(deity.boundaries.omnipotent, true, 'Should be omnipotent');
  });
}

// ==================== ENTERPRISE SWARM MANAGER TESTS ====================
console.log('\n👥 Enterprise Swarm Manager Domain Tests');

test('CLAUDE.md documents all 15 manager domains', () => {
  const expectedManagers = [
    'Discovery & Requirements',
    'Product & Strategy',
    'Architecture',
    'Design',
    'Frontend Development',
    'Backend Development',
    'Integration',
    'Operations',
    'Quality Assurance',
    'Release & DevOps',
    'Documentation',
    'Infrastructure',
    'Customer Success',
    'Research',
    'Culture & Morale'
  ];

  for (const manager of expectedManagers) {
    assert.ok(claudeMd.includes(manager), `Should document ${manager} manager`);
  }
});

test('CLAUDE.md documents IC roles', () => {
  const sampleICs = [
    'Requirements Gathering IC',
    'Solutions Architect IC',
    'Branch Engineer IC',
    'Forward Deployed Engineer IC',
    'Pizza'
  ];

  for (const ic of sampleICs) {
    assert.ok(claudeMd.includes(ic), `Should document ${ic}`);
  }
});

// ==================== PROMPT TEMPLATE TESTS ====================
console.log('\n📝 Agent Prompt Template Tests');

test('CLAUDE.md has Director prompt template', () => {
  assert.ok(claudeMd.includes('Director Prompt Template') || claudeMd.includes('# You Are: Director'),
    'Should have Director prompt template');
});

test('CLAUDE.md has Manager prompt template', () => {
  assert.ok(claudeMd.includes('Manager Prompt Template') || claudeMd.includes('{DOMAIN} Manager'),
    'Should have Manager prompt template');
});

test('CLAUDE.md has IC prompt template', () => {
  assert.ok(claudeMd.includes('IC Prompt Template') || claudeMd.includes('Independent Contributor'),
    'Should have IC prompt template');
});

test('Templates include session ID placeholder', () => {
  assert.ok(claudeMd.includes('{SESSION_ID}') || claudeMd.includes('session_id'),
    'Templates should include session ID');
});

test('Templates include sentiment assessment', () => {
  assert.ok(claudeMd.includes('Sentiment Assessment') || claudeMd.includes('sentiment'),
    'Templates should include sentiment assessment');
});

// ==================== FEATURE CONFIG FILE TESTS ====================
console.log('\n📁 Configuration File Tests');

test('Init command references features.json config', () => {
  if (initCommand) {
    assert.ok(initCommand.includes('features.json') || initCommand.includes('settings.json'),
      'Should reference feature configuration file');
  }
});

test('Init command shows feature JSON structure', () => {
  if (initCommand) {
    assert.ok(initCommand.includes('"logging"') || initCommand.includes('logging'),
      'Should show logging configuration');
  }
});

// Summary
console.log('\n' + '═'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
