#!/usr/bin/env node
/**
 * PostToolUse hook that sanitizes sensitive data from command output
 *
 * Replaces IPs, emails, paths, credentials, and other sensitive patterns
 * before Claude sees the output. Maintains a mapping for consistency.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { tmpdir, homedir } from 'os';

const MAPPING_FILE = join(tmpdir(), 'claude-sanitizer-map.json');
const USERNAME = process.env.USER || process.env.USERNAME || 'user';

// Sanitization patterns with replacements
const PATTERNS = [
  // IP Addresses
  {
    name: 'ipv4',
    regex: /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replace: (match, map) => {
      // Preserve localhost and common private ranges patterns
      if (match === '127.0.0.1' || match === '0.0.0.0') return match;
      if (match.startsWith('192.168.')) return `192.168.X.${getConsistentId(match, map, 'ip')}`;
      if (match.startsWith('10.')) return `10.X.X.${getConsistentId(match, map, 'ip')}`;
      if (match.startsWith('172.')) return `172.X.X.${getConsistentId(match, map, 'ip')}`;
      return `[IP_${getConsistentId(match, map, 'ip')}]`;
    }
  },

  // IPv6
  {
    name: 'ipv6',
    regex: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
    replace: () => '[IPV6_REDACTED]'
  },

  // MAC Addresses
  {
    name: 'mac',
    regex: /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g,
    replace: (match, map) => `[MAC_${getConsistentId(match, map, 'mac')}]`
  },

  // Email Addresses
  {
    name: 'email',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replace: (match, map) => `user${getConsistentId(match, map, 'email')}@example.com`
  },

  // Home directory paths
  {
    name: 'home_path',
    regex: new RegExp(`/Users/${USERNAME}(?=/|$|\\s)`, 'g'),
    replace: () => '/Users/[USER]'
  },

  // Generic home paths
  {
    name: 'home_generic',
    regex: /\/home\/[a-zA-Z0-9_-]+(?=\/|$|\s)/g,
    replace: () => '/home/[USER]'
  },

  // AWS Keys
  {
    name: 'aws_key',
    regex: /AKIA[0-9A-Z]{16}/g,
    replace: () => '[AWS_ACCESS_KEY_REDACTED]'
  },

  // AWS Secret
  {
    name: 'aws_secret',
    regex: /(?<=["\s:=])[A-Za-z0-9/+=]{40}(?=["\s,\n]|$)/g,
    replace: () => '[AWS_SECRET_REDACTED]'
  },

  // Private Keys
  {
    name: 'private_key',
    regex: /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
    replace: () => '[PRIVATE_KEY_REDACTED]'
  },

  // SSH Keys
  {
    name: 'ssh_key',
    regex: /ssh-(?:rsa|ed25519|ecdsa)\s+[A-Za-z0-9+/]+=*\s*\S*/g,
    replace: () => '[SSH_PUBLIC_KEY_REDACTED]'
  },

  // JWT Tokens
  {
    name: 'jwt',
    regex: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*/g,
    replace: () => '[JWT_REDACTED]'
  },

  // Bearer Tokens
  {
    name: 'bearer',
    regex: /Bearer\s+[A-Za-z0-9-_.]+/gi,
    replace: () => 'Bearer [TOKEN_REDACTED]'
  },

  // Password fields in config/env
  {
    name: 'password_field',
    regex: /(?<=(?:password|passwd|pwd|secret|token|api_key|apikey|auth)\s*[=:]\s*)[^\s\n"']+/gi,
    replace: () => '[REDACTED]'
  },

  // Connection strings
  {
    name: 'connection_string',
    regex: /(?:mysql|postgres|mongodb|redis|amqp):\/\/[^\s"']+/gi,
    replace: (match) => {
      const proto = match.split('://')[0];
      return `${proto}://[CONNECTION_REDACTED]`;
    }
  },

  // Credit card patterns (basic)
  {
    name: 'credit_card',
    regex: /\b(?:\d{4}[- ]?){3}\d{4}\b/g,
    replace: () => '[CARD_REDACTED]'
  },

  // SSN patterns
  {
    name: 'ssn',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    replace: () => '[SSN_REDACTED]'
  },

  // Phone numbers (US format)
  {
    name: 'phone',
    regex: /\b(?:\+1[- ]?)?(?:\([0-9]{3}\)|[0-9]{3})[- ]?[0-9]{3}[- ]?[0-9]{4}\b/g,
    replace: () => '[PHONE_REDACTED]'
  },

  // UUIDs (optional - might want to keep for debugging)
  // {
  //   name: 'uuid',
  //   regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
  //   replace: (match, map) => `[UUID_${getConsistentId(match, map, 'uuid')}]`
  // },

  // Hostnames (be careful - only internal ones)
  {
    name: 'internal_host',
    regex: /\b[a-zA-Z][a-zA-Z0-9-]*\.(?:local|internal|corp|lan)\b/gi,
    replace: (match, map) => `host${getConsistentId(match, map, 'host')}.internal`
  }
];

// Load or create mapping for consistent replacements
function loadMapping() {
  try {
    if (existsSync(MAPPING_FILE)) {
      return JSON.parse(readFileSync(MAPPING_FILE, 'utf8'));
    }
  } catch {}
  return { ip: {}, mac: {}, email: {}, host: {}, _counter: {} };
}

function saveMapping(map) {
  try {
    writeFileSync(MAPPING_FILE, JSON.stringify(map, null, 2));
  } catch {}
}

function getConsistentId(value, map, type) {
  if (!map[type]) map[type] = {};
  if (!map._counter) map._counter = {};
  if (!map._counter[type]) map._counter[type] = 0;

  if (!map[type][value]) {
    map._counter[type]++;
    map[type][value] = map._counter[type];
  }
  return map[type][value];
}

function sanitize(text, map) {
  let result = text;
  const sanitizedFields = [];

  for (const pattern of PATTERNS) {
    const before = result;
    if (typeof pattern.replace === 'function') {
      result = result.replace(pattern.regex, (match) => pattern.replace(match, map));
    } else {
      result = result.replace(pattern.regex, pattern.replace);
    }
    if (before !== result) {
      sanitizedFields.push(pattern.name);
    }
  }

  return { text: result, fields: sanitizedFields };
}

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

  // Only process tools that produce output
  if (!input.tool_result) {
    process.exit(0);
  }

  const map = loadMapping();

  // Sanitize the output
  const output = typeof input.tool_result === 'string'
    ? input.tool_result
    : JSON.stringify(input.tool_result);

  const { text: sanitized, fields } = sanitize(output, map);

  saveMapping(map);

  if (fields.length > 0) {
    // Return sanitized output to replace original
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        sanitization: {
          applied: true,
          patternsMatched: fields,
          originalSize: output.length,
          sanitizedSize: sanitized.length
        },
        // This tells Claude Code to use sanitized output
        modifiedResult: sanitized
      }
    }));
  }

} catch {
  // Silent failure
}
