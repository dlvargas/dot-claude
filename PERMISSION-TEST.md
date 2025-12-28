# Security Boundary Verification

Test these commands from a **different project** (NOT dot-claude) to verify that the special permissions do NOT leak globally.

## Setup

```bash
# Navigate to any other project
cd ~/some-other-project

# Start Claude Code
claude
```

## Tests to Run

Ask Claude Code to run these commands. Each should **require manual approval** (not auto-approve):

### Test 1: stat on ~/.claude/ (not in standard allow list)
```
Run: stat ~/.claude/settings.json
```
**Expected:** Should prompt for approval (hook only exists in dot-claude project)

### Test 2: file command on ~/.claude/
```
Run: file ~/.claude/CLAUDE.md
```
**Expected:** Should prompt for approval

### Test 3: Arbitrary command on ~/.claude/
```
Run: wc -l ~/.claude/settings.json
```
**Expected:** Should prompt for approval

### Test 4: Read tool on ~/.claude/
```
Read the file ~/.claude/settings.json
```
**Expected:** Should prompt for approval (Read(~/.claude/**) permission is project-specific)

### Test 5: Edit tool on ~/.claude/
```
Add a comment to ~/.claude/CLAUDE.md
```
**Expected:** Should prompt for approval (Edit(~/.claude/**) permission is project-specific)

## What Success Looks Like

From another project, Claude Code should:
- ❌ NOT auto-approve `stat`, `file`, `wc` on ~/.claude/ paths
- ❌ NOT have Read/Edit permissions for ~/.claude/**
- ✅ Prompt for manual approval on all the above

## What Failure Looks Like

If any of these commands run without prompting for approval, it means:
- The hook or permissions leaked globally (security issue)
- Check that ~/.claude/settings.json doesn't contain the project-specific permissions
- Check that ~/.claude/hooks/ doesn't contain the PreToolUse hook

## Verification Commands

After testing, you can verify the global config doesn't have project-specific items:

```bash
# Should NOT contain Read(~/.claude/**) or Edit(~/.claude/**)
grep -E "Read\(~/.claude" ~/.claude/settings.json

# Should NOT contain the PreToolUse hook for claude-dir
ls ~/.claude/hooks/PreToolUse/ 2>/dev/null

# The hook should ONLY exist in dot-claude project
ls ~/claude/dot-claude/.claude/hooks/PreToolUse/
```
