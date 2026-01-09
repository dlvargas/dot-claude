# Initialize Autonomous Claude Project

Comprehensive project initialization with guided feature selection.

---

## Overview

This command configures a project with modular autonomous Claude capabilities. It guides users through:
1. Security level selection (10 levels)
2. Core autonomous features (8 features)
3. Orchestration modes (4 modes)
4. Swarm configuration (40 manager domains)
5. Quality enforcement options
6. Module installation

---

## Instructions

### Step 1: Create Project Structure

```bash
mkdir -p .claude/config .claude/logs .claude/backups .claude/diffs .claude/rules
```

### Step 2: Security Level Selection

Use AskUserQuestion:

**Header:** "Security"
**Question:** "What security level would you like for this project?"
**MultiSelect:** false
**Options:**

1. **👤 asuser (Recommended)** - Local user access with git requirement. Balanced security for most projects.
2. **🔒 jailed** - Maximum restriction. Project-only access. For untrusted code review.
3. **📦 sandbox** - Extended dev tools with aggressive backup. Safe experimentation.
4. **🎮 playground** - All safe system tools. No destructive operations allowed.

If user selects "Other", offer advanced levels:

**Header:** "Advanced Security"
**Question:** "Select an advanced security level:"
**Options:**

1. **👤🌐 asuserremote** - Local + remote access (SSH, UART). For infrastructure work.
2. **🔑 asroot** - Full local sudo access. For system administration tasks.
3. **🔑🌐 asrootremote** - Full local + remote sudo. Critical operations.
4. **🎸 BACKSTAGEPASS** - Near-full access with soft-delete protection. Power users.
5. **🎤 ALLACCESSPASS** - Unrestricted access. Complete trust.
6. **⚡ INSERTDIETYHERE** - Omnipotent. No restrictions whatsoever. FOR TRUE BELIEVERS.

### Step 3: Core Features Selection

Use AskUserQuestion:

**Header:** "Core Features"
**Question:** "Which core autonomous features would you like enabled?"
**MultiSelect:** true
**Options:**

1. **Auto Git Commits (Recommended)** - Commit after each logical unit of work. Atomic change tracking.
2. **Auto Backups (Recommended)** - Create backups before any file modification. Safety net for changes.
3. **Session Logging** - Activity logs in `.claude/logs/`. Audit trail and debugging.
4. **Diff Tracking** - Generate diffs for all changes in `.claude/diffs/`. Change documentation.

### Step 4: Developer Experience Features

Use AskUserQuestion:

**Header:** "Dev Experience"
**Question:** "Which developer experience features would you like?"
**MultiSelect:** true
**Options:**

1. **Auto Linting (Recommended)** - Automatically lint files after edits. Consistent code style.
2. **Path Sanitization** - Mask sensitive paths in output. Privacy protection.
3. **Smart Context** - Intelligent context loading based on task. Memory optimization.
4. **Interactive Mode** - Ask clarifying questions before major changes. Safer execution.

### Step 5: Orchestration Mode Selection

Use AskUserQuestion:

**Header:** "Orchestration"
**Question:** "Which orchestration modes would you like enabled?"
**MultiSelect:** true
**Options:**

1. **Director Mode (Recommended)** - Enable sub-agent delegation for complex tasks. Parallel execution.
2. **Swarm Mode** - Full enterprise multi-agent teams with 40 manager domains and 200+ IC roles.
3. **Structured SDLC** - Phased workflow (Discovery → Design → Development → Delivery) with sign-off gates.
4. **100% and 100%** - Require 100% code coverage AND 100% tests passing before PR creation.

### Step 6: Swarm Configuration (If Swarm Mode Enabled)

If user enabled Swarm Mode, ask:

**Header:** "Swarm Preset"
**Question:** "Which swarm configuration preset would you like?"
**MultiSelect:** false
**Options:**

1. **Minimal (5 Managers)** - Discovery, Architecture, Frontend, Backend, QA. Good for small teams.
2. **Standard (12 Managers)** - Minimal + Product, Design, Docs, DevOps, Security, Integration, Ops.
3. **Enterprise (20 Managers)** - Standard + Infrastructure, Customer Success, Data, Analytics, Platform, Research, Performance, Observability.
4. **Full (40 Managers)** - All 40 manager domains with 200+ IC roles. Maximum capability.

If user wants custom selection, offer domain picker:

**Header:** "Custom Domains"
**Question:** "Select specific manager domains to enable:"
**MultiSelect:** true
**Options (show in groups):**

**Core Development:**
1. Discovery & Requirements - Requirements, needs analysis, research
2. Product & Strategy - Planning, product design, forward tech, executive advisors
3. Architecture - App architecture, solutions, ML/LLM, data, security, enterprise, cloud
4. Design (UX/UI) - Customer, internal, vendor UX/UI, research, design systems, accessibility

**Development:**
5. Frontend Development - B2C, internal, vendor, performance, state management, components, mobile
6. Backend Development - Backend, branch engineering, API, database, jobs, search, caching, real-time
7. Integration - Customer, business integration, API gateway, ETL, webhooks, legacy, third-party
8. Operations - Biz/revenue ops, marketing, sales, email/comms, analytics, billing

**Quality & Delivery:**
9. Quality Assurance - Dev QA, internal/customer regression, performance, security testing, automation
10. Release & DevOps - CI/CD, IaC, deployment, release coordination, feature flags, rollback
11. Documentation - Customer user/admin/tech docs, internal user/dev docs, API docs, tutorials
12. Infrastructure - Data center, systems infra, storage, network, containers, observability, SRE

**Customer & Research:**
13. Customer Success - CSM, forward deployed engineer, onboarding, support, feedback, churn prevention
14. Research - Principal research, applied research, research engineering, data science, innovation lab
15. Culture & Morale - Pizza guy, team events, recognition, wellness, communications
16. Security - AppSec, InfraSec, SecOps, compliance, incident response, awareness, threat intel, IAM

**Data & Analytics:**
17. Data Management - Governance, quality, MDM, privacy, catalog, lineage
18. Analytics & BI - BI, visualization, reporting, self-service, embedded
19. Platform Engineering - Platform, DevEx, tooling, reliability, self-service infra

**Specialized:**
20. Mobile Development - iOS, Android, React Native/Flutter, mobile DevOps
21. AI/ML Engineering - ML platform, training, serving, MLOps, AI safety
22. Performance Engineering - Load testing, APM, DB performance, CDN
23. Accessibility - WCAG, assistive tech, a11y testing
24. Internationalization - i18n engineering, translation, cultural adaptation, RTL
25. Content Management - CMS dev, content modeling, media, workflow
26. E-commerce - Catalog, cart, checkout, orders, inventory
27. Payments - Gateway, fraud, reconciliation, PCI
28. Communications - Email, SMS/push, in-app, preferences
29. Workflow Automation - Workflow engine, rules, approvals, BPM
30. Legal & Compliance - Privacy engineering, terms, audit trail, compliance reporting
31. Vendor Management - Evaluation, contracts, integration
32. Technical Writing - Doc writer, API writer, tutorials, knowledge base
33. Training & Enablement - Course dev, LMS, certification, delivery
34. Community - DevRel, engagement, open source, events
35. Support Operations - Ticketing, KB, chatbot, escalation
36. Growth Engineering - Onboarding, referrals, viral loops, retention
37. Experimentation - Platform, feature experiments, stats, reporting
38. Observability - Metrics, logging, tracing, alerting, dashboards
39. Chaos Engineering - Experiments, game days, failure injection
40. Cost Optimization - Cloud cost, reserved capacity, spot, allocation

### Step 7: Parallel Model Selection (If Director Mode Enabled)

If user enabled Director Mode:

**Header:** "Parallel Models"
**Question:** "Which parallel agent models would you like available?"
**MultiSelect:** true
**Options:**

1. **Peer Review Pipeline** - Author → Reviewer → Approver for high-quality code
2. **Adversarial Testing** - Builder vs Breaker for security-critical code
3. **Parallel Specialists** - Frontend/Backend/DB/Docs in parallel for full-stack features
4. **Evolution/Iteration** - v1 → v2 → v3 for algorithm optimization
5. **Debate/Consensus** - Multiple approaches → Moderator synthesis for architecture decisions
6. **Red Team/Blue Team** - Defenders vs Attackers for security audits
7. **Assembly Line** - Parse → Transform → Validate → Test → Doc for batch processing

### Step 8: Apply Configuration

After gathering preferences, apply the configuration:

#### 8.1 Set Sandbox Level
```bash
echo "{selected_level}" > .claude/sandbox-level
```

#### 8.2 Create Features Config
```bash
cat > .claude/config/features.json << 'EOF'
{
  "sandboxLevel": "{selected_level}",
  "logging": {true|false},
  "autoBackups": {true|false},
  "autoGitCommits": {true|false},
  "diffTracking": {true|false},
  "autoLinting": {true|false},
  "pathSanitization": {true|false},
  "smartContext": {true|false},
  "interactiveMode": {true|false},
  "directorMode": {true|false},
  "swarmMode": {true|false},
  "structuredSdlc": {true|false},
  "hundredAndHundred": {true|false},
  "swarmPreset": "{preset}",
  "swarmDomains": ["{list of enabled domains}"],
  "parallelModels": ["{list of enabled models}"]
}
EOF
```

#### 8.3 Copy Enabled Modules
Based on selections, copy appropriate modules to `.claude/rules/`:

| Feature | Source | Action |
|---------|--------|--------|
| Always | `~/.claude/modules/core/CLAUDE.core.md` | Copy as base |
| directorMode | `~/.claude/modules/director-pattern.md` | Copy to rules |
| directorMode | `~/.claude/modules/parallel-models.md` | Copy to rules |
| swarmMode | `~/.claude/modules/swarm/architecture.md` | Copy to rules |
| swarmMode | `~/.claude/modules/swarm/swarm-director.md` | Copy to rules |
| swarmMode | `~/.claude/modules/swarm/ic-prompts.md` | Copy to rules |
| structuredSdlc | `~/.claude/modules/sdlc-workflow.md` | Copy to rules |

### Step 9: Create Project CLAUDE.md

Generate a minimal project-specific CLAUDE.md:

```markdown
# {Project Name}

## Overview
{Brief description of the project}

## Tech Stack
{List of technologies used}

## Commands
```bash
# Build
{build_command}

# Test
{test_command}

# Lint
{lint_command}
```

## Configuration

**Security Level:** {selected_level} {emoji}
**Sandbox:** {description}

### Enabled Features
{For each enabled feature, list with checkbox:}
- ✅ Auto Git Commits
- ✅ Auto Backups
- ✅ Session Logging
- ✅ Diff Tracking
- ⬜ Swarm Mode (disabled)
{etc.}

### Swarm Configuration
{If swarm enabled:}
**Preset:** {preset_name}
**Managers:** {count}
**ICs:** {count}

{List enabled domains}

---

*Inherits from ~/.claude/modules/core/CLAUDE.core.md*
*Features configured in .claude/config/features.json*
```

### Step 10: Success Report

Present the completed configuration:

```
╔══════════════════════════════════════════════════════════════╗
║              PROJECT INITIALIZED SUCCESSFULLY                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Security Level: {level} {emoji}                             ║
║                                                              ║
║  Core Features:                                              ║
║    ✅ Auto Git Commits                                       ║
║    ✅ Auto Backups                                           ║
║    ✅ Session Logging                                        ║
║    ✅ Diff Tracking                                          ║
║    {etc.}                                                    ║
║                                                              ║
║  Orchestration:                                              ║
║    {✅|⬜} Director Mode                                      ║
║    {✅|⬜} Swarm Mode ({preset})                              ║
║    {✅|⬜} Structured SDLC                                    ║
║    {✅|⬜} 100% and 100%                                      ║
║                                                              ║
║  {If Swarm enabled:}                                         ║
║  Swarm Configuration:                                        ║
║    Preset: {preset}                                          ║
║    Managers: {count}                                         ║
║    ICs: {count}                                              ║
║                                                              ║
║  Files Created:                                              ║
║    .claude/config/features.json                              ║
║    .claude/sandbox-level                                     ║
║    .claude/rules/*.md                                        ║
║    CLAUDE.md                                                 ║
║                                                              ║
║  Available Commands:                                         ║
║    /commit  - Auto-commit current changes                    ║
║    /pr      - Create pull request                            ║
║    /ship    - Commit → Push → PR                             ║
║    /review  - Code review changes                            ║
║    /status  - Session status                                 ║
║    /sandbox - Change security level                          ║
║    {/swarm  - Activate swarm (if enabled)}                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Complete Security Levels Reference

| Level | Emoji | Risk | Access | Git Required |
|-------|-------|------|--------|--------------|
| `jailed` | 🔒 | Minimal | Project only | No |
| `sandbox` | 📦 | Low | + Dev tools | No |
| `playground` | 🎮 | Low | All safe tools | No |
| `asuser` | 👤 | Moderate | Local user | Yes |
| `asuserremote` | 👤🌐 | Moderate-High | + SSH/UART | Yes |
| `asroot` | 🔑 | High | + sudo | Yes |
| `asrootremote` | 🔑🌐 | Critical | + remote sudo | Yes |
| `BACKSTAGEPASS` | 🎸 | Extreme | Near-full | Yes |
| `ALLACCESSPASS` | 🎤 | Maximum | Unrestricted | Yes |
| `INSERTDIETYHERE` | ⚡ | Divine | Omnipotent | Yes |

---

## Complete Feature Reference

### Core Features

| Feature | Default | Description |
|---------|---------|-------------|
| `logging` | ✅ On | Session activity logs in `.claude/logs/` |
| `autoBackups` | ✅ On | Backup files before modification |
| `autoGitCommits` | ✅ On | Commit after each logical unit of work |
| `diffTracking` | ✅ On | Generate diffs in `.claude/diffs/` |

### Developer Experience

| Feature | Default | Description |
|---------|---------|-------------|
| `autoLinting` | ✅ On | Automatic linting after file edits |
| `pathSanitization` | ✅ On | Mask sensitive paths in output |
| `smartContext` | ⬜ Off | Intelligent context loading |
| `interactiveMode` | ⬜ Off | Ask before major changes |

### Orchestration

| Feature | Default | Description |
|---------|---------|-------------|
| `directorMode` | ✅ On | Enable sub-agent delegation |
| `swarmMode` | ⬜ Off | Enterprise multi-agent teams |
| `structuredSdlc` | ⬜ Off | Phased workflow with gates |
| `hundredAndHundred` | ⬜ Off | 100% coverage, 100% passing |

---

## Swarm Presets Reference

### Minimal (5 Managers)
- Discovery & Requirements
- Architecture
- Frontend Development
- Backend Development
- Quality Assurance

### Standard (12 Managers)
- All Minimal (5)
- Product & Strategy
- Design (UX/UI)
- Documentation
- Release & DevOps
- Security
- Integration
- Operations

### Enterprise (20 Managers)
- All Standard (12)
- Infrastructure
- Customer Success
- Data Management
- Analytics & BI
- Platform Engineering
- Research
- Performance Engineering
- Observability

### Full (40 Managers)
All 40 manager domains with 200+ IC roles.

---

## Parallel Models Reference

| Model | Best For |
|-------|----------|
| Peer Review Pipeline | High-quality code with multiple perspectives |
| Adversarial Testing | Security-critical code, edge cases |
| Parallel Specialists | Full-stack features, multiple domains |
| Evolution/Iteration | Complex algorithms, optimization |
| Debate/Consensus | Architecture decisions, design choices |
| Red Team/Blue Team | Security audits, pen testing |
| Assembly Line | Batch processing, migrations |
