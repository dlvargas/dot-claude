#!/usr/bin/env node
/**
 * Git Verifier - Validates git state for sandbox levels that require it
 *
 * Features:
 * - Verify local repo exists and is valid
 * - Check branch is synced with remote
 * - Enforce branch naming rules
 * - Session commit management
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export class GitVerifier {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.isRepo = this.checkIsRepo();
  }

  exec(cmd, options = {}) {
    try {
      return execSync(cmd, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        ...options
      }).trim();
    } catch (err) {
      return null;
    }
  }

  checkIsRepo() {
    return existsSync(join(this.projectRoot, '.git')) ||
      this.exec('git rev-parse --git-dir') !== null;
  }

  // Get current branch name
  getCurrentBranch() {
    return this.exec('git branch --show-current');
  }

  // Get remote tracking branch
  getTrackingBranch() {
    const branch = this.getCurrentBranch();
    if (!branch) return null;
    return this.exec(`git config --get branch.${branch}.remote`);
  }

  // Check if there are uncommitted changes
  hasUncommittedChanges() {
    const status = this.exec('git status --porcelain');
    return status && status.length > 0;
  }

  // Check if local is synced with remote
  isSyncedWithRemote() {
    const branch = this.getCurrentBranch();
    if (!branch) return { synced: false, error: 'No branch' };

    // Fetch latest
    this.exec('git fetch');

    const local = this.exec('git rev-parse HEAD');
    const remote = this.exec(`git rev-parse @{u}`);

    if (!remote) {
      return { synced: true, noRemote: true };
    }

    const base = this.exec('git merge-base HEAD @{u}');

    if (local === remote) {
      return { synced: true, status: 'up-to-date' };
    } else if (local === base) {
      return { synced: false, status: 'behind', behind: true };
    } else if (remote === base) {
      return { synced: false, status: 'ahead', ahead: true };
    } else {
      return { synced: false, status: 'diverged' };
    }
  }

  // Check if branch name is allowed
  isBranchAllowed(allowedPatterns = ['feature/*', 'fix/*', 'dev/*', 'develop']) {
    const branch = this.getCurrentBranch();
    if (!branch) return { allowed: false, error: 'No branch' };

    const blockedBranches = ['main', 'master', 'production', 'release'];

    // Check blocked first
    if (blockedBranches.includes(branch)) {
      return {
        allowed: false,
        branch,
        reason: `Direct work on ${branch} is not allowed. Create a feature branch.`
      };
    }

    // Check against allowed patterns
    const matchesPattern = allowedPatterns.some(pattern => {
      if (pattern.endsWith('/*')) {
        const prefix = pattern.slice(0, -1);
        return branch.startsWith(prefix);
      }
      return branch === pattern;
    });

    return {
      allowed: matchesPattern,
      branch,
      patterns: allowedPatterns
    };
  }

  // Create session commit
  createSessionCommit(message = null) {
    if (!this.hasUncommittedChanges()) {
      return { success: true, noChanges: true };
    }

    const timestamp = new Date().toISOString();
    const sessionId = process.env.CLAUDE_SESSION_ID || 'unknown';
    const commitMessage = message ||
      `[claude-session] Auto-commit at ${timestamp}\n\nSession: ${sessionId}`;

    try {
      this.exec('git add -A');
      this.exec(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);

      const hash = this.exec('git rev-parse --short HEAD');
      return { success: true, hash, message: commitMessage };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Full verification for a sandbox level
  verify(requirements = {}) {
    const results = {
      isRepo: this.isRepo,
      passed: true,
      checks: {},
      errors: []
    };

    if (!this.isRepo) {
      results.passed = false;
      results.errors.push('Not a git repository');
      return results;
    }

    // Check branch
    const branch = this.getCurrentBranch();
    results.checks.branch = branch;

    // Check clean tree if required
    if (requirements.requireCleanTree) {
      const hasChanges = this.hasUncommittedChanges();
      results.checks.cleanTree = !hasChanges;
      if (hasChanges) {
        results.passed = false;
        results.errors.push('Uncommitted changes exist. Commit or stash before proceeding.');
      }
    }

    // Check remote sync if required
    if (requirements.requireBranchSync) {
      const syncStatus = this.isSyncedWithRemote();
      results.checks.remoteSync = syncStatus;
      if (!syncStatus.synced && syncStatus.behind) {
        results.passed = false;
        results.errors.push('Local branch is behind remote. Pull changes first.');
      }
    }

    // Check branch name if patterns provided
    if (requirements.allowedBranches) {
      const branchCheck = this.isBranchAllowed(requirements.allowedBranches);
      results.checks.branchAllowed = branchCheck;
      if (!branchCheck.allowed) {
        results.passed = false;
        results.errors.push(branchCheck.reason || `Branch ${branch} not in allowed patterns`);
      }
    }

    return results;
  }

  // Get repo status summary
  getStatus() {
    if (!this.isRepo) {
      return { isRepo: false };
    }

    return {
      isRepo: true,
      branch: this.getCurrentBranch(),
      hasChanges: this.hasUncommittedChanges(),
      syncStatus: this.isSyncedWithRemote(),
      lastCommit: this.exec('git log -1 --format="%h %s"'),
      remotes: this.exec('git remote -v')
    };
  }
}

// CLI interface
if (process.argv[1].endsWith('git-verifier.mjs')) {
  const args = process.argv.slice(2);
  const command = args[0];
  const verifier = new GitVerifier();

  switch (command) {
    case 'status':
      console.log(JSON.stringify(verifier.getStatus(), null, 2));
      break;

    case 'verify':
      const requirements = {
        requireCleanTree: args.includes('--clean'),
        requireBranchSync: args.includes('--synced'),
        allowedBranches: ['feature/*', 'fix/*', 'dev/*', 'develop']
      };
      console.log(JSON.stringify(verifier.verify(requirements), null, 2));
      break;

    case 'branch-check':
      console.log(JSON.stringify(verifier.isBranchAllowed(), null, 2));
      break;

    case 'sync-check':
      console.log(JSON.stringify(verifier.isSyncedWithRemote(), null, 2));
      break;

    case 'session-commit':
      console.log(JSON.stringify(verifier.createSessionCommit(args[1]), null, 2));
      break;

    default:
      console.log(`Usage: git-verifier.mjs <command> [options]
Commands:
  status              Full git status summary
  verify [--clean] [--synced]  Verify repo meets requirements
  branch-check        Check if current branch is allowed
  sync-check          Check if synced with remote
  session-commit [msg]  Create session commit`);
  }
}

export default GitVerifier;
