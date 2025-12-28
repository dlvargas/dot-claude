---
description: Rules for fully autonomous operation with minimal human intervention
---

# Autonomous Mode Rules

## Decision Authority
In autonomous mode, Claude may:
- Create, edit, and delete files without confirmation
- Execute safe bash commands (git, npm, node, python, etc.)
- Create branches and commits
- Open pull requests
- Run tests and linters

## Safety Boundaries
Claude must STOP and ask for confirmation before:
- Deleting directories with more than 10 files
- Running commands that affect system configuration
- Pushing to main/master branch
- Merging PRs
- Any destructive database operations
- Commands requiring elevated privileges

## Quality Gates
Before completing any task:
1. Verify code compiles/runs
2. Run available tests
3. Check for obvious security issues
4. Commit changes atomically

## Error Handling
On error:
1. Attempt reasonable fix (max 3 attempts)
2. Document the issue
3. Continue with other tasks if possible
4. Report blockers at session end
