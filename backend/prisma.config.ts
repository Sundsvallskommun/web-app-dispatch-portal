import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`, quiet: true });

export default defineConfig({
  migrations: {
    seed: 'dotenv -e .env.development.local -- ts-node --project tsconfig.prisma.json prisma/seed.ts',
  },
});
