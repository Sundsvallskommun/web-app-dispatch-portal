import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: 'dotenv -e .env.development.local ts-node prisma/seed.ts',
  },
});
