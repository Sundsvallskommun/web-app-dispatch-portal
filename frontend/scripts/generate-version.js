/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

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
  process.env.GIT_COMMIT || process.env.OPENSHIFT_BUILD_COMMIT || git('rev-parse --short HEAD') || 'unknown';

const branch =
  process.env.GIT_BRANCH || process.env.OPENSHIFT_BUILD_REFERENCE || git('rev-parse --abbrev-ref HEAD') || 'unknown';

const version = {
  commit: commit.slice(0, 12),
  branch,
  buildTime: new Date().toISOString(),
};

const outFile = path.join(process.cwd(), 'public', 'version.json');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(version, null, 2) + '\n');

console.log(`Wrote ${outFile}:`, version);
