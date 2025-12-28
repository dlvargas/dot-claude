# Claude Code Autonomous Configuration

A comprehensive Claude Code configuration package that enables "autonomous mode" - allowing Claude to operate with minimal confirmation prompts for common development tasks.

## What's Included

| Component | Count | Description |
|-----------|-------|-------------|
| **Hooks** | 4 | Event-driven scripts for session management and git workflows |
| **Commands** | 8 | Slash commands for commits, PRs, reviews, and more |
| **Skills** | 4 | Context-aware instructions triggered by prompt keywords |
| **Rules** | 3 | Behavioral guidelines for autonomous operation |
| **Plugins** | 40+ | Official Anthropic marketplace (pre-cached) |

## Installation

### Global Installation (Recommended)

Copy the contents to your home Claude directory:

```bash
# Backup existing config if present
cp -r ~/.claude ~/.claude.backup 2>/dev/null

# Copy this configuration
cp -r hooks commands skills rules settings.json CLAUDE.md ~/.claude/
cp -r plugins ~/.claude/  # Optional: includes official marketplace cache
```

### Per-Project Installation

Use the `/init-autonomous` command after global installation, or manually copy to a project's `.claude/` directory.

## What Changes

### Hooks

| Event | Hook | Effect |
|-------|------|--------|
| `SessionStart` | session-start.mjs | Injects context recovery instructions |
| `PreCompact` | pre-compact.mjs | Saves session state before context compaction |
| `UserPromptSubmit` | skill-activation.mjs | Suggests relevant skills based on prompt keywords |
| `Stop` | auto-git-workflow.mjs | Reminds about uncommitted changes |

### Slash Commands

| Command | Description |
|---------|-------------|
| `/commit` | Auto-commit with semantic message |
| `/pr` | Create pull request with comprehensive description |
| `/ship` | Full workflow: commit → push → PR |
| `/review` | Code review on changes or PR |
| `/status` | Display session and project status |
| `/autonomous` | Enable maximum autonomy mode |
| `/init-autonomous` | Set up project with autonomous config |
| `/clone-setup` | Clone repo and initialize autonomous config |

### Pre-Approved Permissions

The following commands run without confirmation prompts:

- **Git**: `git`, `gh`
- **Package managers**: `npm`, `npx`, `pip`, `pip3`
- **Runtimes**: `node`, `python`, `python3`
- **File operations**: `ls`, `mkdir`, `cp`, `mv`, `touch`, `chmod`
- **Utilities**: `cat`, `head`, `tail`, `grep`, `find`, `diff`, `tree`, `curl`
- **Containers**: `docker`, `docker-compose`
- **Tools**: `Write`, `Edit`, `MultiEdit`, `Read`, `Glob`, `Grep`

### Skills (Prompt-Triggered)

Skills activate automatically when your prompt contains relevant keywords:

| Skill | Triggers | Priority |
|-------|----------|----------|
| `git-automation` | commit, push, pr, merge, branch | Critical |
| `session-management` | feature, implement, build, refactor | Critical |
| `code-review` | review, check, audit, security | High |
| `testing` | test, spec, coverage, e2e | High |

## Official Plugin Marketplace

The `plugins/` directory contains a cached clone of `anthropics/claude-plugins-official`. No plugins are auto-enabled.

### Available Plugin Categories

- **LSP (Code Intelligence)**: TypeScript, Python, Go, Rust, C/C++, Java, PHP, Swift, C#, Lua
- **Integrations**: GitHub, GitLab, Slack, Notion, Linear, Asana, Figma, Sentry, Vercel, Supabase, Firebase
- **Workflows**: commit-commands, pr-review-toolkit, code-review, hookify
- **Development**: agent-sdk-dev, plugin-dev, feature-dev, frontend-design

### Installing a Plugin

```bash
/plugin install plugin-name@claude-plugins-official
```

### Updating the Marketplace

```bash
cd ~/.claude/plugins/marketplaces/claude-plugins-official && git pull
```

## Usage

### Basic Workflow

1. Start Claude Code in your project
2. Work normally - hooks provide context and suggestions
3. Use `/commit` when ready to commit changes
4. Use `/ship` to commit, push, and create a PR

### Autonomous Mode

Run `/autonomous` to acknowledge full autonomous operation. Claude will:
- Create, edit, delete files without confirmation
- Run git commands freely (except push to main/master)
- Execute npm, node, python commands
- Create branches and commits automatically

### Protected Operations

Even in autonomous mode, Claude will confirm before:
- Pushing to main/master/production branches
- Merging pull requests
- Destructive operations (rm -rf, DROP TABLE)
- System configuration changes

## File Structure

```
~/.claude/
├── settings.json          # Permissions + hook configuration
├── CLAUDE.md              # Global behavioral instructions
├── hooks/
│   ├── auto-git-workflow.mjs
│   ├── ContextRecoveryHook/
│   │   ├── pre-compact.mjs
│   │   └── session-start.mjs
│   └── SkillActivationHook/
│       └── skill-activation.mjs
├── commands/
│   ├── autonomous.md
│   ├── commit.md
│   ├── pr.md
│   ├── ship.md
│   ├── review.md
│   ├── status.md
│   ├── init-autonomous.md
│   └── clone-setup.md
├── skills/
│   ├── skill-rules.json
│   ├── git-automation/
│   ├── session-management/
│   ├── code-review/
│   └── testing/
├── rules/
│   ├── autonomous-mode.md
│   ├── code-quality.md
│   └── git-workflow.md
└── plugins/
    └── marketplaces/
        └── claude-plugins-official/  # Official Anthropic plugins
```

## Known Limitations

1. **Missing skill**: The `documentation` skill is referenced in `skill-rules.json` but the directory doesn't exist
2. **Node.js required**: Hooks are JavaScript (.mjs) and require Node.js to be installed

## Customization

### Disable Specific Hooks

Edit `settings.json` and remove the hook entries you don't want.

### Modify Permissions

Edit the `permissions.allow` array in `settings.json` to add or remove pre-approved commands.

### Add Custom Skills

Create a new directory under `skills/` with a `SKILL.md` file and add trigger rules to `skill-rules.json`.

## License

This configuration package is provided as-is. The official Anthropic plugins in `plugins/marketplaces/claude-plugins-official/` are subject to Anthropic's terms.
