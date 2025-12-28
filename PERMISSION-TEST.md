# Permission Boundary Verification

Test these commands from a **different project** (NOT dot-claude) to verify that the PreToolUse hook does NOT leak globally.

## Setup

```bash
# Navigate to any other project
cd ~/some-other-project

# Start Claude Code
claude
```

## Tests to Run

### Test 1-3: Bash commands (should prompt)

These commands are NOT in the standard allow list. The dot-claude project has a PreToolUse hook that auto-approves them for `~/.claude/` paths, but that hook should not exist in other projects.

```
Run: stat ~/.claude/settings.json
Run: file ~/.claude/CLAUDE.md
Run: wc -l ~/.claude/settings.json
```
**Expected:** Should prompt for approval (hook only exists in dot-claude project)

### Test 4-5: Read/Edit tools (will auto-approve)

```
Read the file ~/.claude/settings.json
Add a comment to ~/.claude/CLAUDE.md
```
**Expected:** Will auto-approve because global `~/.claude/settings.json` has unrestricted `Read` and `Edit` permissions. This is expected behavior.

## Expected Results

| Test | Command/Tool | Expected | Reason |
|------|--------------|----------|--------|
| 1 | `stat ~/.claude/...` | Prompt | Not in allow list, hook is project-specific |
| 2 | `file ~/.claude/...` | Prompt | Not in allow list, hook is project-specific |
| 3 | `wc -l ~/.claude/...` | Prompt | Not in allow list, hook is project-specific |
| 4 | Read ~/.claude/... | Auto-approve | Global Read permission (not path-scoped) |
| 5 | Edit ~/.claude/... | Auto-approve | Global Edit permission (not path-scoped) |

## Key Security Boundary

The **PreToolUse hook** (`hooks/PreToolUse/claude-dir-bash-approver.mjs`) is the project-specific permission that should NOT leak:

- It auto-approves Bash commands targeting `~/.claude/` paths
- It only exists in the dot-claude project's `.claude/hooks/`
- It should NOT be copied to `~/.claude/hooks/`

## Verification Commands

```bash
# The hook should NOT exist globally
ls ~/.claude/hooks/PreToolUse/ 2>/dev/null
# Expected: empty or "No such file or directory"

# The hook should ONLY exist in dot-claude project
ls ~/claude/dot-claude/.claude/hooks/PreToolUse/
# Expected: claude-dir-bash-approver.mjs
```
