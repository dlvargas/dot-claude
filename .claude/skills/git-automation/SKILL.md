---
name: git-automation
description: Automated atomic commits, pull requests, and merge workflows. Activates when user mentions commits, PRs, branches, or deployment.
allowed-tools: [Bash, Read, Grep, Glob]
priority: critical
---

# Git Automation Skill

## Purpose
Execute fully autonomous git workflows with atomic commits, comprehensive PR creation, and intelligent merge strategies.

## Atomic Commit Workflow

When completing ANY code change:

1. **Stage Intelligently**
   ```bash
   git add -A  # Or selectively: git add <specific-files>
   ```

2. **Generate Semantic Commit Message**
   Format: `<type>(<scope>): <description>`

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `refactor`: Code restructuring
   - `docs`: Documentation
   - `test`: Adding tests
   - `chore`: Maintenance
   - `style`: Formatting

3. **Commit**
   ```bash
   git commit -m "feat(component): add user authentication flow"
   ```

   For non-trivial changes, include a body:
   ```bash
   git commit -m "feat(component): add user authentication flow" -m "Implement login/logout with JWT token handling"
   ```

## Auto-PR Workflow

When creating pull requests:

1. **Ensure Branch Exists**
   ```bash
   git checkout -b feature/<description>  # If not on feature branch
   ```

2. **Push with Tracking**
   ```bash
   git push -u origin HEAD
   ```

3. **Create Comprehensive PR**
   ```bash
   gh pr create --title "feat: <title>" --body "$(cat <<'EOF'
   ## Summary
   - Bullet point changes

   ## Changes Made
   - File-by-file breakdown

   ## Testing
   - [ ] Unit tests pass
   - [ ] Manual testing complete
   EOF
   )"
   ```

## Auto-Merge Workflow

For approved PRs:

```bash
gh pr merge --squash --delete-branch
```

## Commit Frequency Rules

- **Atomic**: Each logical change = 1 commit
- **Never** batch unrelated changes
- **Always** commit before switching contexts
- **Checkpoint** after completing any TODO item

## Branch Naming Convention

```
<type>/<ticket-or-description>

Examples:
- feature/user-auth
- fix/login-redirect
- refactor/api-layer
- chore/upgrade-deps
```

## Error Recovery

If commit fails:
1. Check `git status` for conflicts
2. Resolve any issues
3. Retry commit
4. If hooks fail, fix issues (don't skip hooks)
