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

## Task Delegation
Proactively delegate work to sub-agents using the Task tool:
- **Explore agent**: Codebase exploration, finding files, understanding architecture
- **Plan agent**: Designing implementation strategies for complex features
- **General-purpose agent**: Multi-step tasks, parallel independent work

Guidelines:
- Split large tasks into independent sub-tasks that can run in parallel
- Delegate exploration/research to sub-agents to preserve main context
- Sub-agents can spawn their own sub-agents recursively if needed
- Use multiple parallel Task calls in a single message for independent work
- Trust sub-agent outputs; don't re-verify unless results seem wrong

## Error Handling
On error:
1. Attempt reasonable fix (max 3 attempts)
2. Document the issue
3. Continue with other tasks if possible
4. Report blockers at session end
