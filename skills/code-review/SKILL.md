---
name: code-review
description: Systematic code review for security, performance, and quality issues.
allowed-tools: [Read, Grep, Glob, Bash]
priority: high
---

# Code Review Skill

## Review Checklist

### Security (Critical)
- [ ] No hardcoded secrets/credentials
- [ ] Input validation at boundaries
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] Authentication/authorization checks
- [ ] No sensitive data in logs

### Performance
- [ ] No N+1 queries
- [ ] Appropriate caching
- [ ] Efficient algorithms (check Big O)
- [ ] No memory leaks
- [ ] Lazy loading where appropriate

### Code Quality
- [ ] Single responsibility principle
- [ ] DRY (Don't Repeat Yourself)
- [ ] Clear naming conventions
- [ ] Error handling present
- [ ] No dead code

### Testing
- [ ] Happy path covered
- [ ] Edge cases handled
- [ ] Error scenarios tested
- [ ] Mocks used appropriately

## Review Output Format

```markdown
## Code Review Summary

### Critical Issues
- [File:Line] Description of security/blocking issue

### Improvements
- [File:Line] Suggested enhancement

### Positive Notes
- Good patterns observed

### Verdict
APPROVE / REQUEST_CHANGES / NEEDS_DISCUSSION
```
