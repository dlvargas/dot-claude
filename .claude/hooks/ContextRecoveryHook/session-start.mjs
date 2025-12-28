#!/usr/bin/env node
/**
 * Session Start Hook: Detects if recovering from compaction
 * Injects context recovery instructions if marker file exists
 */

import { readFileSync, unlinkSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const MARKER_PATH = join(homedir(), '.claude', 'claudefast-compaction-marker');

function main() {
  try {
    // Check if recovering from compaction
    if (existsSync(MARKER_PATH)) {
      const markerData = JSON.parse(readFileSync(MARKER_PATH, 'utf8'));

      // Delete the marker (one-time use)
      unlinkSync(MARKER_PATH);

      // Inject recovery context
      const recoveryContext = {
        additionalContext: `
## SESSION RECOVERY DETECTED

This session is resuming after context compaction.

**Recovery Actions Required:**
1. Re-read CLAUDE.md for project rules and current focus
2. Check .claude/skills/ for any active skill context
3. Review recent git log for work continuity: \`git log --oneline -5\`
4. Check for uncommitted changes: \`git status\`

**Previous Session Info:**
- Compacted at: ${markerData.compactedAt}
- Project: ${markerData.projectPath}

Please acknowledge recovery and continue where we left off.
`
      };

      console.log(JSON.stringify(recoveryContext));
    } else {
      // Normal session start - inject project context
      const projectContext = {
        additionalContext: `
## SESSION INITIALIZED

**Quick Context:**
- Run \`git status\` to see current state
- Check CLAUDE.md for project rules
- Skills available in .claude/skills/

Ready for autonomous operation.
`
      };

      console.log(JSON.stringify(projectContext));
    }
  } catch (error) {
    // Silent fail - don't break session start
    console.log(JSON.stringify({ status: 'ok' }));
  }
}

main();
