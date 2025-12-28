# Auto-Commit Command

Analyze all current changes and create an atomic commit with a semantic message.

## Instructions

1. Run `git status` to see all changes
2. Run `git diff` to understand what changed
3. Determine the appropriate commit type:
   - `feat`: New feature
   - `fix`: Bug fix
   - `refactor`: Code restructuring
   - `docs`: Documentation
   - `test`: Tests
   - `chore`: Maintenance

4. Stage all relevant changes:
   ```bash
   git add -A
   ```

5. Create commit with semantic message:
   ```bash
   git commit -m "$(cat <<'EOF'
   <type>(<scope>): <description>

   <body if needed>

   🤖 Generated with Claude Code

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

6. Report the commit hash and summary
