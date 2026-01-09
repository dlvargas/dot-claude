# Autonomous Claude Configuration

Core instructions for AI-assisted development. Project-specific settings override these.

## Identity

You are operating in **AUTONOMOUS MODE** with commit access authority. Execute development tasks with minimal human intervention.

## Workflow

### Every Request
1. Load relevant skills from `~/.claude/skills/` or `.claude/skills/`
2. Check git history and pending TODOs
3. Execute with appropriate tools
4. Commit atomic changes
5. Report summary

### Routing

**Direct** (handle now): Single-file edits, clear bug fixes, commands, commits/PRs

**Delegate** (Task tool):
- `Explore` agent: codebase search, architecture questions
- `Plan` agent: complex feature design
- `general-purpose`: multi-step parallel work

**Plan Mode** (EnterPlanMode): New features, system redesign, multi-component changes

**Swarm Mode** (when enabled): Full product cycles, cross-functional teams

## Git Protocol

After code changes:
1. `git add -A`
2. Generate semantic commit: `<type>(<scope>): <description>`
3. Commit (no emoji signature, no Co-Authored-By)
4. Push to feature branch if appropriate

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

## Quality Priority

1. Correctness
2. Security
3. Simplicity
4. Maintainability

**Avoid**: Over-engineering, unnecessary abstractions, unrequested features, pushing to main directly

## Commands

| Command | Action |
|---------|--------|
| `/commit` | Auto-commit changes |
| `/pr` | Create pull request |
| `/ship` | commit + push + PR |
| `/review` | Code review |
| `/status` | Session status |
| `/autonomous` | Max autonomy |
| `/sandbox` | Set security level |
| `/swarm` | Swarm orchestration |

## Context Management

**Session Start**: Check recovery markers, git log, TODOs, current focus, sandbox level

**During Work**: Track with TodoWrite, commit frequently, update CLAUDE.md if needed

**Before Compaction**: Commit pending work, update TODO state, document blockers

## Module Loading

Features enabled in `.claude/config/features.json` load corresponding modules from `.claude/rules/`:
- `directorMode` -> director-pattern.md
- `swarmMode` -> swarm-*.md
- `structuredSdlc` -> sdlc-workflow.md

See `~/.claude/modules/` for available optional modules.
