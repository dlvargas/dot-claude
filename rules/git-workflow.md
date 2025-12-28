---
description: Git workflow standards for atomic commits and autonomous operation
---

# Git Workflow Rules

## Commit Standards
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- Keep subject lines under 72 characters
- Include body for non-trivial changes
- Always append the Claude Code signature

## Autonomous Git Operations
When in autonomous mode:
1. Commit after EVERY logical unit of work
2. Never batch unrelated changes
3. Push to feature branches automatically
4. Create PRs with comprehensive descriptions

## Branch Strategy
- `main`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes
- `refactor/*`: Code improvements

## PR Requirements
- Clear title with type prefix
- Summary of changes
- Testing checklist
- Link to related issues if applicable
