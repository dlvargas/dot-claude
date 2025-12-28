---
description: Code quality standards for all implementations
---

# Code Quality Rules

## Priority Order
1. Correctness - Code does what it should
2. Security - No vulnerabilities
3. Maintainability - Easy to understand and modify
4. Performance - Efficient execution
5. Brevity - Concise but readable

## Avoid Over-Engineering
- Don't add features not requested
- Don't create abstractions for single-use code
- Don't add error handling for impossible scenarios
- Don't add comments for self-evident code
- Keep changes minimal and focused

## Required Practices
- Validate input at system boundaries
- Use parameterized queries for databases
- Encode output to prevent XSS
- Never log sensitive data
- Handle errors gracefully

## Forbidden Patterns
- Hardcoded credentials
- Eval of user input
- Unvalidated redirects
- SQL string concatenation
- Console.log in production code
