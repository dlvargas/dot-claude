# Code Review Command

Perform comprehensive code review on recent changes or specified files.

## Arguments
$ARGUMENTS - Optional: specific files or PR number to review

## Instructions

1. **Determine Scope**
   - If PR number provided: `gh pr diff $ARGUMENTS`
   - If files provided: Review those files
   - If nothing: Review uncommitted changes via `git diff`

2. **Security Review**
   - [ ] Check for hardcoded secrets
   - [ ] Verify input validation
   - [ ] Check for SQL injection risks
   - [ ] Look for XSS vulnerabilities
   - [ ] Verify auth/authz checks

3. **Quality Review**
   - [ ] Code follows project patterns
   - [ ] No unnecessary complexity
   - [ ] Error handling present
   - [ ] No dead code

4. **Performance Review**
   - [ ] No obvious N+1 queries
   - [ ] Appropriate data structures
   - [ ] No memory leaks

5. **Output Format**
   ```markdown
   ## Code Review: <scope>

   ### Critical Issues
   - [file:line] Issue description

   ### Suggestions
   - [file:line] Improvement suggestion

   ### Positive Notes
   - Good patterns observed

   ### Verdict
   ✅ APPROVE | ⚠️ NEEDS CHANGES | 💬 DISCUSS
   ```
