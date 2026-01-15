#!/usr/bin/env node
/**
 * Sandbox Manager - Handles path sanitization with reversible mappings
 *
 * Provides:
 * - Path sanitization (project-relative visible, external masked)
 * - Username/home directory masking
 * - Reverse mapping for when Claude needs to execute commands
 * - Session-scoped mapping persistence
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, basename, relative, resolve, isAbsolute, join } from 'path';
import { createHash } from 'crypto';
import { homedir } from 'os';

const HOME = homedir();
const USERNAME = process.env.USER || process.env.USERNAME || 'user';

export class SandboxManager {
  constructor(projectRoot, mappingFile = null) {
    this.projectRoot = resolve(projectRoot || process.cwd());
    this.mappingFile = mappingFile || join(this.projectRoot, '.claude', 'sandbox', 'mappings.json');
    this.mappings = { pathToSafe: {}, safeToPath: {}, fileHashes: {} };
    this.counter = 0;
    this.loadMappings();
  }

  loadMappings() {
    try {
      if (existsSync(this.mappingFile)) {
        const data = JSON.parse(readFileSync(this.mappingFile, 'utf8'));
        this.mappings = data.mappings || this.mappings;
        this.counter = data.counter || 0;
      }
    } catch {}
  }

  saveMappings() {
    try {
      const dir = dirname(this.mappingFile);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(this.mappingFile, JSON.stringify({
        projectRoot: this.projectRoot,
        counter: this.counter,
        mappings: this.mappings,
        savedAt: new Date().toISOString()
      }, null, 2));
    } catch {}
  }

  // Generate short hash for external paths
  hashPath(path) {
    const hash = createHash('md5').update(path).digest('hex').slice(0, 8);
    return hash;
  }

  // Check if path is within project
  isInProject(path) {
    const absPath = resolve(path);
    return absPath.startsWith(this.projectRoot);
  }

  // Check if path is a system executable
  isSystemExecutable(path) {
    const systemPaths = ['/usr/bin', '/bin', '/usr/local/bin', '/opt/homebrew/bin', '/sbin', '/usr/sbin'];
    const absPath = resolve(path);
    return systemPaths.some(sp => absPath.startsWith(sp));
  }

  // Sanitize a single path
  sanitizePath(path) {
    if (!path) return path;

    const absPath = isAbsolute(path) ? path : resolve(this.projectRoot, path);

    // Already mapped?
    if (this.mappings.pathToSafe[absPath]) {
      return this.mappings.pathToSafe[absPath];
    }

    // Within project - make relative with $PROJECT prefix
    if (this.isInProject(absPath)) {
      const relPath = relative(this.projectRoot, absPath);
      const safePath = relPath === '' ? '$PROJECT' : `$PROJECT/${relPath}`;
      this.addMapping(absPath, safePath);
      return safePath;
    }

    // System executable - allow but sanitize home parts
    if (this.isSystemExecutable(absPath)) {
      return absPath; // System binaries are visible
    }

    // Home directory paths
    if (absPath.startsWith(HOME)) {
      const relToHome = relative(HOME, absPath);
      const safePath = `/home/user/${relToHome}`;
      this.addMapping(absPath, safePath);
      return safePath;
    }

    // External path - hash and map
    const hash = this.hashPath(absPath);
    const name = basename(absPath);
    const safePath = `[EXT:${hash}]/${name}`;
    this.addMapping(absPath, safePath);
    return safePath;
  }

  // Reverse: convert safe path back to real path
  unsanitizePath(safePath) {
    if (!safePath) return safePath;

    // Check reverse mapping
    if (this.mappings.safeToPath[safePath]) {
      return this.mappings.safeToPath[safePath];
    }

    // $PROJECT prefix
    if (safePath.startsWith('$PROJECT')) {
      const relPath = safePath.replace(/^\$PROJECT\/?/, '');
      return relPath ? join(this.projectRoot, relPath) : this.projectRoot;
    }

    // /home/user prefix
    if (safePath.startsWith('/home/user/')) {
      const relPath = safePath.replace('/home/user/', '');
      return join(HOME, relPath);
    }

    // [EXT:hash] pattern
    const extMatch = safePath.match(/^\[EXT:([a-f0-9]+)\]/);
    if (extMatch) {
      // Look up in file hashes
      const hash = extMatch[1];
      for (const [realPath, mappedHash] of Object.entries(this.mappings.fileHashes)) {
        if (mappedHash === hash) {
          return realPath;
        }
      }
    }

    return safePath; // Return as-is if no mapping found
  }

  addMapping(realPath, safePath) {
    this.mappings.pathToSafe[realPath] = safePath;
    this.mappings.safeToPath[safePath] = realPath;

    // Store hash for reverse lookup
    const hashMatch = safePath.match(/\[EXT:([a-f0-9]+)\]/);
    if (hashMatch) {
      this.mappings.fileHashes[realPath] = hashMatch[1];
    }

    this.saveMappings();
  }

  // Sanitize username in text
  sanitizeUsername(text) {
    if (!text) return text;

    let result = text;

    // Replace macOS home paths first (most specific)
    result = result.replace(new RegExp(`/Users/${USERNAME}(/[^\\s]*)?`, 'g'), (match, rest) => {
      return '/home/user' + (rest || '');
    });

    // Replace Linux home paths
    result = result.replace(new RegExp(`/home/${USERNAME}(/[^\\s]*)?`, 'g'), (match, rest) => {
      return '/home/user' + (rest || '');
    });

    // Replace Windows home paths
    result = result.replace(new RegExp(`C:\\\\Users\\\\${USERNAME}(\\\\[^\\s]*)?`, 'gi'), (match, rest) => {
      return 'C:\\Users\\user' + (rest || '');
    });

    // Replace standalone username occurrences (word boundary)
    result = result.replace(new RegExp(`\\b${USERNAME}\\b`, 'g'), 'user');

    return result;
  }

  // Sanitize all paths in text
  sanitizeText(text) {
    if (!text) return text;

    let result = this.sanitizeUsername(text);

    // Find and replace absolute paths
    const pathPattern = /(?:\/[\w.-]+)+|(?:[A-Z]:\\[\w.-\\]+)/g;
    result = result.replace(pathPattern, (match) => {
      // Skip if it looks like a URL path
      if (match.includes('://')) return match;
      return this.sanitizePath(match);
    });

    return result;
  }

  // Unsanitize all paths in text (for command execution)
  unsanitizeText(text) {
    if (!text) return text;

    let result = text;

    // Replace $PROJECT paths
    result = result.replace(/\$PROJECT(?:\/[\w.-]+)*/g, (match) => {
      return this.unsanitizePath(match);
    });

    // Replace /home/user paths
    result = result.replace(/\/home\/user(?:\/[\w.-]+)*/g, (match) => {
      return this.unsanitizePath(match);
    });

    // Replace [EXT:hash] paths
    result = result.replace(/\[EXT:[a-f0-9]+\](?:\/[\w.-]+)*/g, (match) => {
      return this.unsanitizePath(match);
    });

    return result;
  }

  // Sanitize environment variables
  sanitizeEnv(env) {
    const sanitized = {};
    const hidePatterns = [
      /^HOME$/,
      /^USER$/,
      /^USERNAME$/,
      /^LOGNAME$/,
      /^SSH_/,
      /^AWS_/,
      /^GITHUB_/,
      /^API_/,
      /^SECRET/i,
      /^TOKEN/i,
      /^PASSWORD/i,
      /^CREDENTIAL/i,
      /^PRIVATE/i,
    ];

    for (const [key, value] of Object.entries(env || process.env)) {
      const shouldHide = hidePatterns.some(p => p.test(key));
      if (!shouldHide) {
        sanitized[key] = this.sanitizeText(value);
      }
    }

    // Override critical paths
    sanitized.HOME = '/home/user';
    sanitized.USER = 'user';
    sanitized.PWD = this.sanitizePath(process.cwd());

    return sanitized;
  }

  // Get project-relative path for display
  getDisplayPath(path) {
    return this.sanitizePath(path);
  }

  // Export mappings for debugging
  getMappings() {
    return {
      projectRoot: this.projectRoot,
      mappingCount: Object.keys(this.mappings.pathToSafe).length,
      mappings: this.mappings
    };
  }
}

// CLI usage
if (process.argv[1].endsWith('sandbox-manager.mjs')) {
  const args = process.argv.slice(2);
  const command = args[0];
  const input = args[1];

  const manager = new SandboxManager(process.cwd());

  switch (command) {
    case 'sanitize':
      console.log(manager.sanitizeText(input || ''));
      break;
    case 'unsanitize':
      console.log(manager.unsanitizeText(input || ''));
      break;
    case 'sanitize-path':
      console.log(manager.sanitizePath(input || ''));
      break;
    case 'unsanitize-path':
      console.log(manager.unsanitizePath(input || ''));
      break;
    case 'mappings':
      console.log(JSON.stringify(manager.getMappings(), null, 2));
      break;
    default:
      console.log(`Usage: sandbox-manager.mjs <command> [input]
Commands:
  sanitize <text>       Sanitize paths and usernames in text
  unsanitize <text>     Reverse sanitization for execution
  sanitize-path <path>  Sanitize a single path
  unsanitize-path <path> Reverse a sanitized path
  mappings              Show current mappings`);
  }
}

export default SandboxManager;
