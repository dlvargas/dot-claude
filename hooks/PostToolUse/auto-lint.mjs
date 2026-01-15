#!/usr/bin/env node
/**
 * PostToolUse hook that suggests linting after file writes
 *
 * Detects file types and suggests appropriate linting commands.
 * Returns a message to Claude suggesting lint actions.
 */

import { readFileSync } from 'fs';
import { extname, basename, dirname } from 'path';

const LINT_CONFIG = {
  // JavaScript/TypeScript
  '.js': { linter: 'eslint', cmd: 'npx eslint --fix' },
  '.jsx': { linter: 'eslint', cmd: 'npx eslint --fix' },
  '.ts': { linter: 'eslint', cmd: 'npx eslint --fix' },
  '.tsx': { linter: 'eslint', cmd: 'npx eslint --fix' },
  '.mjs': { linter: 'eslint', cmd: 'npx eslint --fix' },
  '.cjs': { linter: 'eslint', cmd: 'npx eslint --fix' },

  // Python
  '.py': { linter: 'ruff', cmd: 'ruff check --fix', alt: 'black' },

  // Go
  '.go': { linter: 'gofmt', cmd: 'gofmt -w' },

  // Rust
  '.rs': { linter: 'rustfmt', cmd: 'rustfmt' },

  // JSON
  '.json': { linter: 'prettier', cmd: 'npx prettier --write' },

  // YAML
  '.yml': { linter: 'prettier', cmd: 'npx prettier --write' },
  '.yaml': { linter: 'prettier', cmd: 'npx prettier --write' },

  // Markdown
  '.md': { linter: 'prettier', cmd: 'npx prettier --write' },

  // Shell
  '.sh': { linter: 'shellcheck', cmd: 'shellcheck' },
  '.bash': { linter: 'shellcheck', cmd: 'shellcheck' },

  // CSS
  '.css': { linter: 'prettier', cmd: 'npx prettier --write' },
  '.scss': { linter: 'prettier', cmd: 'npx prettier --write' },
  '.less': { linter: 'prettier', cmd: 'npx prettier --write' },

  // HTML
  '.html': { linter: 'prettier', cmd: 'npx prettier --write' },
  '.htm': { linter: 'prettier', cmd: 'npx prettier --write' },
};

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

  // Only process Write and Edit tools
  if (!['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
    process.exit(0);
  }

  const filePath = input.tool_input?.file_path || input.tool_input?.filePath;
  if (!filePath) {
    process.exit(0);
  }

  const ext = extname(filePath).toLowerCase();
  const config = LINT_CONFIG[ext];

  if (config) {
    // Output suggestion for Claude to consider
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        lintSuggestion: {
          file: filePath,
          linter: config.linter,
          command: `${config.cmd} "${filePath}"`,
          message: `Consider running ${config.linter} on ${basename(filePath)}`
        }
      }
    }));
  }
} catch {
  // Silent failure - don't interrupt workflow
}
