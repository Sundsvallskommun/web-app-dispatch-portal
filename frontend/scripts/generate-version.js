/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Writes public/version.json at build time so the running instance can show
 * which git commit/branch it was built from.
 *
 * Resolves values with this fallback order so it works for both deploy paths:
 *   1. Explicit env / build-args (GIT_COMMIT, GIT_BRANCH)        -> manual override
 *   2. OpenShift build env (OPENSHIFT_BUILD_COMMIT / _REFERENCE) -> pipeline build (.git is dockerignored)
 *   3. `git` CLI                                                 -> manual server build (yarn build in checkout)
 *   4. 'unknown'
 *
 * Runs automatically via the "prebuild" npm script before `next build`.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const git = (args) => {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
};

const commit =
  process.env.GIT_COMMIT ||
  process.env.OPENSHIFT_BUILD_COMMIT ||
  git('rev-parse --short HEAD') ||
  'unknown';

const branch =
  process.env.GIT_BRANCH ||
  process.env.OPENSHIFT_BUILD_REFERENCE ||
  git('rev-parse --abbrev-ref HEAD') ||
  'unknown';

const version = {
  commit: commit.slice(0, 12),
  branch,
  buildTime: new Date().toISOString(),
};

const outFile = path.join(process.cwd(), 'public', 'version.json');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(version, null, 2) + '\n');

console.log(`Wrote ${outFile}:`, version);
