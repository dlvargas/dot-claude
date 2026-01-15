# Sandbox Level Rules

## Current Level
Check `.claude/sandbox-level` or `$CLAUDE_SANDBOX_LEVEL` for active level.

## Level Summary

| Level | Access | Sanitization | Git Required | Remote |
|-------|--------|--------------|--------------|--------|
| jailed | Project only | Aggressive | No | No |
| sandbox | + Dev tools | Aggressive | No | No |
| playground | + All safe | Moderate | No | No |
| asuser | + Home | Moderate | Yes | No |
| asuserremote | + SSH/UART | Light | Yes | Yes |
| asroot | + sudo | Light | Yes | No |
| asrootremote | + remote sudo | Light | Yes | Yes |
| BACKSTAGEPASS | Near-full | Users only | Yes | Yes |
| ALLACCESSPASS | Unrestricted | Users only | Yes | Yes |

## Automatic Behaviors

### For ALL Levels
1. **Backup before modify** - Every file change is backed up
2. **Diff tracking** - All changes generate diffs in `.claude/diffs/`
3. **Session directory** - Backups in `.claude/sessions/{date}_{id}/`

### Path Display
Claude always sees sanitized paths:
- `$PROJECT/src/file.ts` (not `/real/path/src/file.ts`)
- `/home/user/.config` (not `/Users/realname/.config`)
- `[EXT:abc123]/file.txt` (external files hashed)

### Soft Delete (BACKSTAGEPASS+)
All `rm` commands become moves to `.claude/trash/{session}/`
- Files can be restored
- Original path preserved in metadata

## Destructive Commands

Commands that require approval (unless BACKSTAGEPASS+):
- `rm`, `rmdir` - File/directory deletion
- `kill`, `killall`, `pkill` - Process termination
- `dd`, `mkfs` - Disk operations

## ALWAYS Blocked
Even at ALLACCESSPASS, these are blocked:
- `rm -rf /`
- `rm -rf /*`
- `dd if=/dev/zero of=/dev/sda`
- Other system-critical disk wipes

## Changing Levels

```bash
# Via command
/sandbox asuser

# Via environment
export CLAUDE_SANDBOX_LEVEL=asroot

# Via file
echo "sandbox" > .claude/sandbox-level
```

## Git Requirements

Levels requiring git (asuser+):
1. Must be in a git repository
2. Branch sync verified (not behind remote)
3. Session commits created automatically
4. Cannot work directly on main/master/production
