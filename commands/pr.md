# Auto-PR Command

Create a comprehensive pull request for the current branch.

## Instructions

1. Check current branch: `git branch --show-current`
2. Ensure not on main: If on main, create feature branch first
3. Check for uncommitted changes and commit them first
4. Get commit history since branching: `git log main..HEAD --oneline`
5. Get full diff: `git diff main...HEAD`

6. Push branch with tracking:
   ```bash
   git push -u origin HEAD
   ```

7. Create PR with comprehensive description:
   ```bash
   gh pr create --title "<type>: <title>" --body "$(cat <<'EOF'
   ## Summary
   <2-3 bullet points describing the change>

   ## Changes
   <File-by-file breakdown of modifications>

   ## Testing
   - [ ] Unit tests pass
   - [ ] Manual testing completed
   - [ ] No regressions identified

   ## Screenshots
   <If UI changes, add screenshots>

   ---
   🤖 Generated with Claude Code
   EOF
   )"
   ```

8. Report the PR URL
