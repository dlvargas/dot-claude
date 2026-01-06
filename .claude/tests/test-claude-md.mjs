#!/usr/bin/env node
/**
 * Tests for CLAUDE.md Structure and Content Validation
 * Ensures comprehensive documentation of all systems
 */

import { strict as assert } from 'assert';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const PROJECT_ROOT = process.cwd();

console.log('🧪 Testing CLAUDE.md Structure and Content\n');

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

// Load all CLAUDE.md files
const claudeMdPaths = [
  join(PROJECT_ROOT, 'CLAUDE.md'),
  join(PROJECT_ROOT, '.claude', 'CLAUDE.md'),
  join(HOME, '.claude', 'CLAUDE.md')
];

let projectClaudeMd, localClaudeMd, globalClaudeMd;

try {
  projectClaudeMd = readFileSync(claudeMdPaths[0], 'utf8');
} catch (e) {
  console.error('Failed to load project CLAUDE.md');
  process.exit(1);
}

try {
  localClaudeMd = readFileSync(claudeMdPaths[1], 'utf8');
} catch (e) {
  localClaudeMd = null;
}

try {
  globalClaudeMd = readFileSync(claudeMdPaths[2], 'utf8');
} catch (e) {
  globalClaudeMd = null;
}

// ==================== SYNC VERIFICATION TESTS ====================
console.log('🔄 Three-Way Sync Tests');

test('Project CLAUDE.md exists', () => {
  assert.ok(projectClaudeMd, 'Project CLAUDE.md should exist');
});

test('Local .claude/CLAUDE.md exists', () => {
  assert.ok(localClaudeMd, '.claude/CLAUDE.md should exist');
});

test('Global ~/.claude/CLAUDE.md exists', () => {
  assert.ok(globalClaudeMd, '~/.claude/CLAUDE.md should exist');
});

test('All three CLAUDE.md files are in sync', () => {
  if (localClaudeMd && globalClaudeMd) {
    assert.equal(projectClaudeMd, localClaudeMd, 'Project and local should match');
    assert.equal(projectClaudeMd, globalClaudeMd, 'Project and global should match');
  }
});

// ==================== REQUIRED SECTIONS TESTS ====================
console.log('\n📋 Required Sections Tests');

const requiredSections = [
  'Project Overview',
  'Tech Stack',
  'Three-Way Sync',
  'Global Claude Orchestration',
  'Enterprise Swarm Architecture',
  'Git Automation Protocol',
  'Quality Standards',
  'Slash Commands',
  'Context Management'
];

for (const section of requiredSections) {
  test(`Has "${section}" section`, () => {
    assert.ok(projectClaudeMd.includes(section), `Should have ${section} section`);
  });
}

// ==================== INITIALIZATION PROTOCOL TESTS ====================
console.log('\n🚀 Initialization Protocol Tests');

test('Has Project Initialization Protocol section', () => {
  assert.ok(projectClaudeMd.includes('Project Initialization Protocol'));
});

test('Documents default privilege level', () => {
  assert.ok(projectClaudeMd.includes('Default Privilege Level'));
});

test('Documents First-Time Setup Prompts', () => {
  assert.ok(projectClaudeMd.includes('First-Time Setup Prompts') ||
    projectClaudeMd.includes('Setup Prompts'));
});

test('Documents Security Level Selection', () => {
  assert.ok(projectClaudeMd.includes('Security Level Selection') ||
    projectClaudeMd.includes('security level'));
});

test('Documents Feature Selection', () => {
  assert.ok(projectClaudeMd.includes('Feature Selection'));
});

// ==================== SWARM ARCHITECTURE TESTS ====================
console.log('\n🏗️ Swarm Architecture Documentation Tests');

test('Has hierarchy diagram', () => {
  assert.ok(projectClaudeMd.includes('DIRECTOR') || projectClaudeMd.includes('Director Claude'));
  assert.ok(projectClaudeMd.includes('MANAGER') || projectClaudeMd.includes('Manager'));
});

test('Documents 15 manager domains', () => {
  const managerCount = (projectClaudeMd.match(/### \d+\./g) || []).length;
  assert.ok(managerCount >= 15, `Should document at least 15 managers, found ${managerCount}`);
});

test('Documents IC roles in tables', () => {
  const icRoleMatches = projectClaudeMd.match(/IC Role.*Responsibility/g) || [];
  assert.ok(icRoleMatches.length > 0, 'Should have IC role tables');
});

// ==================== AGENT PROMPT TEMPLATE TESTS ====================
console.log('\n📝 Agent Prompt Template Tests');

test('Has Director Prompt Template', () => {
  assert.ok(projectClaudeMd.includes('Director Prompt Template'));
});

test('Has Manager Prompt Template', () => {
  assert.ok(projectClaudeMd.includes('Manager Prompt Template'));
});

test('Has IC Prompt Template', () => {
  assert.ok(projectClaudeMd.includes('IC Prompt Template'));
});

test('Templates are in markdown code blocks', () => {
  const codeBlocks = projectClaudeMd.match(/```markdown[\s\S]*?```/g) || [];
  assert.ok(codeBlocks.length >= 3, 'Should have at least 3 markdown code blocks for templates');
});

// ==================== IC ROLE PROMPTS TESTS ====================
console.log('\n👤 IC Role Prompts Tests');

const expectedICRoles = [
  'Requirements Gathering IC',
  'Needs Analysis IC',
  'Principal Research IC',
  'Planning IC',
  'Product Design IC',
  'Application Architecture IC',
  'Solutions Architect IC',
  'ML/LLM Implementation Manager IC',
  'Customer Facing UX/UI Design IC',
  'B2C Front End Development IC',
  'Back End Development IC',
  'Branch Engineer IC',
  'Customer Facing Systems Integration IC',
  'Business and Revenue Operations IC',
  'Development Quality Assurance IC',
  'CI/CD Release Manager IC',
  'Customer User Facing Documentation Lead IC',
  'Systems Infrastructure Engineering IC',
  'Customer Success Manager IC',
  'Forward Deployed Engineer IC',
  'The Guy Who Orders Pizza Every Release IC'
];

test('Documents majority of IC roles', () => {
  let foundCount = 0;
  for (const ic of expectedICRoles) {
    if (projectClaudeMd.includes(ic)) foundCount++;
  }
  const percentage = (foundCount / expectedICRoles.length) * 100;
  assert.ok(percentage >= 80, `Should document at least 80% of IC roles, found ${percentage.toFixed(0)}%`);
});

test('IC role prompts have Expertise section', () => {
  const expertiseMatches = projectClaudeMd.match(/## Expertise/g) || [];
  assert.ok(expertiseMatches.length >= 10, 'Should have Expertise sections for IC roles');
});

test('IC role prompts have Approach section', () => {
  const approachMatches = projectClaudeMd.match(/## Approach/g) || [];
  assert.ok(approachMatches.length >= 10, 'Should have Approach sections for IC roles');
});

test('IC role prompts have Outputs section', () => {
  const outputsMatches = projectClaudeMd.match(/## Outputs/g) || [];
  assert.ok(outputsMatches.length >= 10, 'Should have Outputs sections for IC roles');
});

// ==================== WORKFLOW DOCUMENTATION TESTS ====================
console.log('\n🔄 Workflow Documentation Tests');

test('Documents Operational Workflow', () => {
  assert.ok(projectClaudeMd.includes('Operational Workflow'));
});

test('Documents Routing Logic', () => {
  assert.ok(projectClaudeMd.includes('Routing Logic'));
});

test('Documents Direct Execution cases', () => {
  assert.ok(projectClaudeMd.includes('Direct Execution'));
});

test('Documents Sub-Agent Delegation', () => {
  assert.ok(projectClaudeMd.includes('Sub-Agent Delegation') ||
    projectClaudeMd.includes('Delegation'));
});

test('Documents Planning Mode', () => {
  assert.ok(projectClaudeMd.includes('Planning Mode'));
});

test('Documents Swarm Mode', () => {
  assert.ok(projectClaudeMd.includes('Swarm Mode'));
});

// ==================== GIT AUTOMATION TESTS ====================
console.log('\n🔀 Git Automation Documentation Tests');

test('Documents commit message format', () => {
  assert.ok(projectClaudeMd.includes('Commit Message Format') ||
    projectClaudeMd.includes('<type>(<scope>)'));
});

test('Documents PR creation workflow', () => {
  assert.ok(projectClaudeMd.includes('PR Creation') ||
    projectClaudeMd.includes('pull request'));
});

// ==================== QUALITY STANDARDS TESTS ====================
console.log('\n⭐ Quality Standards Documentation Tests');

test('Documents priority order', () => {
  assert.ok(projectClaudeMd.includes('Priority Order'));
});

test('Lists Correctness as priority', () => {
  assert.ok(projectClaudeMd.includes('Correctness'));
});

test('Lists Security as priority', () => {
  assert.ok(projectClaudeMd.includes('Security'));
});

test('Documents forbidden practices', () => {
  assert.ok(projectClaudeMd.includes('Forbidden'));
});

// ==================== SLASH COMMANDS TESTS ====================
console.log('\n⌨️ Slash Commands Documentation Tests');

const expectedCommands = [
  '/commit',
  '/pr',
  '/ship',
  '/review',
  '/autonomous',
  '/status',
  '/sandbox',
  '/swarm',
  '/init-autonomous'
];

for (const cmd of expectedCommands) {
  test(`Documents ${cmd} command`, () => {
    assert.ok(projectClaudeMd.includes(cmd), `Should document ${cmd}`);
  });
}

// ==================== CONTEXT MANAGEMENT TESTS ====================
console.log('\n🧠 Context Management Documentation Tests');

test('Documents Session Start procedures', () => {
  assert.ok(projectClaudeMd.includes('Session Start'));
});

test('Documents During Work procedures', () => {
  assert.ok(projectClaudeMd.includes('During Work'));
});

test('Documents Before Compaction procedures', () => {
  assert.ok(projectClaudeMd.includes('Before Compaction') ||
    projectClaudeMd.includes('Compaction'));
});

// ==================== SECURITY LEVELS DOCUMENTATION TESTS ====================
console.log('\n🔒 Security Levels Documentation Tests');

const securityLevels = [
  'jailed', 'sandbox', 'playground', 'asuser', 'asuserremote',
  'asroot', 'asrootremote', 'BACKSTAGEPASS', 'ALLACCESSPASS', 'INSERTDIETYHERE'
];

test('Documents all 10 security levels', () => {
  for (const level of securityLevels) {
    assert.ok(projectClaudeMd.includes(level), `Should document ${level}`);
  }
});

// ==================== SPECIAL IC TESTS ====================
console.log('\n🍕 Special IC Documentation Tests');

test('Pizza Guy IC has special instructions', () => {
  assert.ok(projectClaudeMd.includes('Pizza') && projectClaudeMd.includes('Special Instructions'));
});

test('Pizza Guy remembers dietary needs', () => {
  assert.ok(projectClaudeMd.includes('vegetarian') || projectClaudeMd.includes('vegan'));
});

test('Pizza Guy keeps energy high', () => {
  assert.ok(projectClaudeMd.includes('energy high') || projectClaudeMd.includes('Keep the energy'));
});

// ==================== MARKDOWN QUALITY TESTS ====================
console.log('\n📄 Markdown Quality Tests');

test('Has proper heading hierarchy', () => {
  const h1Count = (projectClaudeMd.match(/^# /gm) || []).length;
  const h2Count = (projectClaudeMd.match(/^## /gm) || []).length;
  assert.ok(h1Count >= 1, 'Should have at least one H1');
  assert.ok(h2Count >= 5, 'Should have at least 5 H2 sections');
});

test('Uses tables for structured data', () => {
  const tableCount = (projectClaudeMd.match(/\|.*\|/g) || []).length;
  assert.ok(tableCount >= 20, 'Should use tables extensively');
});

test('Uses code blocks appropriately', () => {
  const codeBlockCount = (projectClaudeMd.match(/```/g) || []).length;
  assert.ok(codeBlockCount >= 20, 'Should have multiple code blocks');
});

test('Has horizontal rules for section separation', () => {
  const hrCount = (projectClaudeMd.match(/^---$/gm) || []).length;
  assert.ok(hrCount >= 3, 'Should use horizontal rules for major sections');
});

// ==================== LENGTH TESTS ====================
console.log('\n📏 Content Length Tests');

test('CLAUDE.md is comprehensive (1000+ lines)', () => {
  const lineCount = projectClaudeMd.split('\n').length;
  assert.ok(lineCount >= 1000, `Should be 1000+ lines, got ${lineCount}`);
  console.log(`     Line count: ${lineCount}`);
});

test('CLAUDE.md documents all IC role prompts in detail', () => {
  // Count IC role prompt sections (looking for "# You Are:" patterns)
  const icPromptCount = (projectClaudeMd.match(/# You Are:/g) || []).length;
  assert.ok(icPromptCount >= 20, `Should have 20+ IC prompts, found ${icPromptCount}`);
});

// Summary
console.log('\n' + '═'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
