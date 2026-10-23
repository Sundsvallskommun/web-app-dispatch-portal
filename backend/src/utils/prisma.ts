import { DATABASE_PROVIDER } from '@/config';
import { PrismaClient } from '@prisma-generated/postgresql';
import { PrismaClient as SqlitePrismaClient } from '@prisma-generated/sqlite';

const createClient = (): PrismaClient => {
  switch (DATABASE_PROVIDER) {
    case 'postgresql':
      return new PrismaClient();
    case 'sqlite':
      return new SqlitePrismaClient() as unknown as PrismaClient;
    default:
      throw new Error(`DATABASE_PROVIDER must be "sqlite" or "postgresql", got "${DATABASE_PROVIDER}"`);
  }
};

const getDevelopmentClient = (): PrismaClient => {
  if (!globalThis.prisma) {
    globalThis.prisma = createClient();
  }

  return globalThis.prisma;
};

const prisma: PrismaClient = process.env.NODE_ENV === 'production' ? createClient() : getDevelopmentClient();

export default prisma;
