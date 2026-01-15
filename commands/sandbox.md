# Set Sandbox Level

Set the security/access level for this Claude session.

## Usage
```
/sandbox <level>
```

## Available Levels

### 🔒 jailed
**Maximum restriction.** Project-only access with full sanitization.
- Only basic file viewing and git
- Full path/username sanitization
- Requires approval for any deletion

### 📦 sandbox
**Extended tools with protection.** Still highly sanitized.
- Development tools available
- No remote access
- Full backup before any change

### 🎮 playground (Default)
**All safe system tools.** No destructive operations.
- Most commands available
- Destructive commands blocked
- Moderate sanitization

### 👤 asuser
**Local user access.** Git repo required.
- Full local file access
- Session commits required
- Branch sync verification

### 👤🌐 asuserremote
**Local + remote access.** SSH and UART enabled.
- SSH, SCP, screen access
- Device access (/dev/tty*, /dev/cu.*)
- PII sanitization enforced

### 🔑 asroot
**Full local sudo access.** Git required.
- All local commands
- System file modification allowed
- Backup before system changes

### 🔑🌐 asrootremote
**Full local + remote sudo.** Maximum local power.
- SSH with sudo
- UART access
- Database/config backup required

### 🎸 BACKSTAGEPASS
**"Production IS development."** Near-full access.
- Everything except system-critical
- Soft-delete for all rm commands
- Users still sanitized

### 🎤 ALLACCESSPASS
**"FUCK IT, WE'RE DOING IT LIVE."** No restrictions.
- Full /dev, /proc, /sys access
- All commands available
- Everything logged and backed up
- Only blocks: `rm -rf /`, disk wipes

### ⚡ INSERTDIETYHERE
**"Omnipotent. Omnipresent. FOR TRUE BELIEVERS."** Divine access.
- No restrictions whatsoever
- No sanitization
- No blocks
- No approval required
- No backups, no logging
- Remote, local, and all points in between
- Absolutely nothing restricted

## Instructions

$ARGUMENTS

Based on the requested level, I will:

1. **Validate the level** exists in sandbox-levels.json
2. **Check prerequisites** (git repo for user+ levels)
3. **Set the level** in .claude/sandbox-level
4. **Confirm** the new restrictions and capabilities

If a git repo is required and not present, I'll help you set one up first.

## Examples

```
/sandbox jailed      # Maximum security
/sandbox playground  # Default, safe development
/sandbox asuser      # Full local access with git
/sandbox BACKSTAGEPASS  # Near-full access
```

## Checking Current Level

The current level is stored in `.claude/sandbox-level` and can be overridden with the `CLAUDE_SANDBOX_LEVEL` environment variable.
