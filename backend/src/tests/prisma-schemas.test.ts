// Guard for the two Prisma schemas behind DATABASE_PROVIDER.
//
// prisma/sqlite and prisma/postgresql must describe the same models, since the app
// picks one client at startup and treats both as the same type. Only the generator
// and datasource blocks may differ. A model change has to go into both schemas,
// each with its own migration.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readModels = (provider: string): string =>
  readFileSync(join(__dirname, '../../prisma', provider, 'schema.prisma'), 'utf8')
    .replace(/(generator|datasource)\s+\w+\s*\{[^}]*\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();

describe('prisma schemas', () => {
  it('defines the same models for sqlite and postgresql', () => {
    expect(readModels('sqlite')).toBe(readModels('postgresql'));
  });

  it('finds the models it compares', () => {
    expect(readModels('postgresql')).toMatch(/model Host \{/);
    expect(readModels('postgresql')).toMatch(/model IDP \{/);
  });
});
