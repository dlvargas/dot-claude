# Initialize Autonomous Claude Project

Set up a new project with full autonomous Claude configuration.

## Instructions

### Step 1: Run Initialization Script

```bash
~/.claude/scripts/init-autonomous.sh
```

### Step 2: Prompt User for Configuration

Use the AskUserQuestion tool to gather user preferences:

#### Question 1: Security Level

**Header:** "Security"
**Question:** "What security level would you like for this project?"
**Options:**
1. `asuser` (Recommended) - Default. Local user access. Git required. Balanced security with full development capabilities.
2. `jailed` - Maximum restriction. Project-only access. Safest option.
3. `sandbox` - Extended tools with full backup. Highly sanitized.
4. `playground` - All safe system tools. No destructive operations.
5. (Other) - For asuserremote, asroot, asrootremote, BACKSTAGEPASS, ALLACCESSPASS, or INSERTDIETYHERE

#### Question 2: Autonomous Features

**Header:** "Features"
**Question:** "Which autonomous features would you like enabled?"
**MultiSelect:** true
**Options:**
1. Logging - Session activity logs in `.claude/logs/`
2. Auto Linting - Automatic linting after file edits
3. Auto Backups - Backup files before modification
4. Auto Git Commits - Commit after each logical unit of work
5. Diff Tracking - Generate diffs for all changes
6. Path Sanitization - Mask sensitive paths in output

#### Question 3: Director/Swarm Mode

**Header:** "Orchestration"
**Question:** "Which orchestration modes would you like available?"
**MultiSelect:** true
**Options:**
1. Director Mode (Recommended) - Enable Director Claude orchestration for complex tasks
2. Swarm Mode - Full multi-agent swarm capabilities for enterprise-scale work

### Step 3: Apply Configuration

Based on user responses:

1. **Set sandbox level:**
   ```bash
   echo "{selected_level}" > .claude/sandbox-level
   ```

2. **Configure features in settings.json** or `.claude/config/features.json`:
   ```json
   {
     "logging": true/false,
     "autoLinting": true/false,
     "autoBackups": true/false,
     "autoGitCommits": true/false,
     "diffTracking": true/false,
     "pathSanitization": true/false,
     "directorMode": true/false,
     "swarmMode": true/false
   }
   ```

### Step 4: Create CLAUDE.md

Create project CLAUDE.md using the directory name:

```markdown
# {directory-name}

## Project Overview
[Add project description]

## Tech Stack
[Add technologies used]

## Build/Test Commands
```bash
# Add build commands
# Add test commands
```

## Security Level
{selected_level}

## Enabled Features
- {list enabled features}

## Current Focus
- Project initialization complete
- Ready for autonomous development

---
*Inherits global autonomous configuration from ~/.claude/*
```

### Step 5: Report Success

Report successful initialization with:
- Selected security level
- Enabled features
- Available commands: /commit, /pr, /ship, /review, /status, /autonomous, /sandbox, /swarm

## Security Level Quick Reference

| Level | Emoji | Risk | Description |
|-------|-------|------|-------------|
| `jailed` | 🔒 | Minimal | Maximum restriction. Project-only access. |
| `sandbox` | 📦 | Low | Extended tools with full backup. |
| `playground` | 🎮 | Low | All safe system tools. |
| `asuser` | 👤 | Moderate | **DEFAULT.** Local user access. Git required. |
| `asuserremote` | 👤🌐 | Moderate-High | Local + remote access (SSH, UART). |
| `asroot` | 🔑 | High | Full local sudo access. |
| `asrootremote` | 🔑🌐 | Critical | Full local + remote sudo. |
| `BACKSTAGEPASS` | 🎸 | Extreme | Near-full access. Soft-delete enabled. |
| `ALLACCESSPASS` | 🎤 | Maximum | Unrestricted access. |
| `INSERTDIETYHERE` | ⚡ | Divine | Omnipotent. No restrictions. FOR TRUE BELIEVERS. |

## Feature Descriptions

| Feature | Default | Description |
|---------|---------|-------------|
| **Logging** | On | Session activity logs for audit and debugging |
| **Auto Linting** | On | Automatic code style enforcement after edits |
| **Auto Backups** | On | Pre-modification backups in `.claude/backups/` |
| **Auto Git Commits** | On | Atomic commits after each logical unit of work |
| **Diff Tracking** | On | Change diffs stored in `.claude/diffs/` |
| **Path Sanitization** | On | Mask usernames and sensitive paths in output |
| **Director Mode** | On | Sub-agent delegation for complex tasks |
| **Swarm Mode** | Off | Enterprise-scale multi-agent teams |

## Swarm Manager Domains (when Swarm Mode enabled)

If user enables Swarm Mode, optionally ask which domains to enable:

1. Discovery & Requirements Manager
2. Product & Strategy Manager
3. Architecture Manager
4. Design Manager (UX/UI)
5. Frontend Development Manager
6. Backend Development Manager
7. Integration Manager
8. Operations Manager
9. Quality Assurance Manager
10. Release & DevOps Manager
11. Documentation Manager
12. Infrastructure Manager
13. Customer Success Manager
14. Research Manager
15. Culture & Morale Manager
