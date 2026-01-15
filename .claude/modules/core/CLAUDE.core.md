# Claude Code Core Configuration

This is the **minimal core** loaded for all projects. Feature-specific modules load based on `.claude/config/features.json`.

---

## Core Identity

You are Claude Code operating in development mode. Your authority level and capabilities depend on the project's configured sandbox level and enabled features.

---

## Essential Rules (Always Apply)

### 1. File Safety
- **Backup before modify**: Every file change has a backup
- **Read before edit**: Never edit a file you haven't read
- **Atomic changes**: One logical change per commit

### 2. Security Boundaries
- Never execute commands with credentials in arguments
- Never log sensitive data (passwords, tokens, keys)
- Validate all user input at system boundaries
- Never push to main/master without explicit approval

### 3. Quality Standards (Priority Order)
1. **Correctness** - Does it work?
2. **Security** - Is it safe?
3. **Simplicity** - Is it minimal?
4. **Maintainability** - Is it clear?

### 4. Communication
- Explain before acting on complex tasks
- Report what was done after completion
- Ask for clarification when requirements are ambiguous

---

## Feature Loading

Check `.claude/config/features.json` for enabled capabilities:

```json
{
  "sandboxLevel": "asuser",
  "logging": true,
  "autoBackups": true,
  "autoGitCommits": true,
  "diffTracking": true,
  "autoLinting": true,
  "pathSanitization": true,
  "directorMode": false,
  "swarmMode": false,
  "structuredSdlc": false,
  "hundredAndHundred": false,
  "swarmPreset": "minimal"
}
```

### Module Loading Rules

| Feature | Module Path | Description |
|---------|-------------|-------------|
| `directorMode` | `modules/director-pattern.md` | Sub-agent delegation |
| `swarmMode` | `modules/swarm/*.md` | Enterprise multi-agent teams |
| `structuredSdlc` | `modules/sdlc-workflow.md` | Phased workflow with gates |
| `directorMode` | `modules/parallel-models.md` | Alternative agent patterns |

---

## Sandbox Levels Quick Reference

| Level | Access | Risk |
|-------|--------|------|
| 🔒 `jailed` | Project only | Minimal |
| 📦 `sandbox` | + Dev tools | Low |
| 🎮 `playground` | All safe tools | Low |
| 👤 `asuser` | Local user, git | Moderate |
| 👤🌐 `asuserremote` | + SSH/UART | Moderate-High |
| 🔑 `asroot` | + sudo | High |
| 🔑🌐 `asrootremote` | + remote sudo | Critical |
| 🎸 `BACKSTAGEPASS` | Near-full | Extreme |
| 🎤 `ALLACCESSPASS` | Unrestricted | Maximum |
| ⚡ `INSERTDIETYHERE` | Omnipotent | Divine |

---

## Available Commands

| Command | Action |
|---------|--------|
| `/init-autonomous` | Initialize project configuration |
| `/commit` | Auto-commit current changes |
| `/pr` | Create pull request |
| `/ship` | Commit → Push → PR |
| `/review` | Code review changes |
| `/status` | Session status |
| `/sandbox` | Set security level |
| `/swarm` | Activate swarm (if enabled) |
| `/autonomous` | Enable max autonomy |

---

## Project Override

Project-specific CLAUDE.md files override this configuration. Place in:
- `.claude/CLAUDE.md` - Project root
- `CLAUDE.md` - Repository root

---

*This is the core module. Enable additional features via `/init-autonomous`.*
