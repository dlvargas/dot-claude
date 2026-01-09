# dot-claude

Source of truth for Claude Code autonomous configuration.

## Stack
- Shell/Bash scripts
- JavaScript/MJS (hooks)
- Markdown (documentation, skills, commands)

## Commands
```bash
# Test suite
node tests/test-sandbox-levels.mjs
node tests/test-backup-manager.mjs
node tests/test-git-verifier.mjs

# Verify sync
diff -rq commands .claude/commands
diff -rq commands ~/.claude/commands
```

## Three-Way Sync

This project is the source. After ANY change:

| Source | Local Deploy | Global Deploy |
|--------|--------------|---------------|
| `commands/` | `.claude/commands/` | `~/.claude/commands/` |
| `scripts/` | `.claude/scripts/` | `~/.claude/scripts/` |
| `skills/` | `.claude/skills/` | `~/.claude/skills/` |
| `rules/` | `.claude/rules/` | `~/.claude/rules/` |
| `hooks/` | `.claude/hooks/` | `~/.claude/hooks/` |
| `modules/` | `.claude/modules/` | `~/.claude/modules/` |
| `CLAUDE.core.md` | - | `~/.claude/CLAUDE.md` |

**DO NOT sync globally:**
- `additionalDirectories: ["~/.claude/"]`
- `Read(~/.claude/**)`, `Edit(~/.claude/**)`
- `hooks/PreToolUse/claude-dir-bash-approver.mjs`

## Module Architecture

```
~/.claude/
├── CLAUDE.md              # Core (from CLAUDE.core.md)
├── rules/                 # Always-loaded rules
│   ├── autonomous-mode.md
│   ├── code-quality.md
│   ├── git-workflow.md
│   └── sandbox-levels.md
└── modules/               # Optional (copied to project .claude/rules/ when enabled)
    ├── director-pattern.md
    ├── parallel-models.md
    ├── sdlc-workflow.md
    └── swarm/
        ├── architecture.md
        ├── ic-prompts.md
        └── swarm-director.md
```

## Feature Loading

When `/init-autonomous` runs:
1. User selects features
2. `.claude/config/features.json` created
3. Enabled modules copied to `.claude/rules/` (auto-loaded)
4. Project CLAUDE.md generated

## Security Level
asuser (this project manages global config)

## Features
- directorMode: enabled
- swarmMode: available in modules
- structuredSdlc: available in modules

---
*Inherits from ~/.claude/CLAUDE.core.md*
