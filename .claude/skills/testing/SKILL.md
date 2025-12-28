---
name: testing
description: Test creation and coverage analysis for comprehensive quality assurance.
allowed-tools: [Read, Write, Edit, Bash, Grep]
priority: high
---

# Testing Skill

## Test Writing Guidelines

### Naming Convention
```
should [expected behavior] when [condition]

Examples:
- should return user when valid ID provided
- should throw error when email is invalid
- should redirect to login when session expired
```

### Test Structure (AAA Pattern)
```javascript
test('should return user when valid ID provided', () => {
  // Arrange
  const userId = 'valid-123';
  const mockUser = { id: userId, name: 'Test' };
  mockDb.findById.mockReturnValue(mockUser);

  // Act
  const result = getUser(userId);

  // Assert
  expect(result).toEqual(mockUser);
});
```

### Coverage Priorities
1. Business logic (critical paths)
2. Error handling
3. Edge cases
4. Integration points

### What NOT to Test
- Third-party library internals
- Simple getters/setters
- Framework code
- Configuration files

## Running Tests
```bash
npm test              # All tests
npm test -- --watch   # Watch mode
npm run test:coverage # With coverage
```

## Coverage Thresholds
- Aim for 80%+ on critical paths
- Don't chase 100% blindly
- Focus on meaningful tests over metrics
