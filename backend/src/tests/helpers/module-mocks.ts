// Modulmockar som delas av de testsviter som bootar hela App:en.
//
// Sviterna gör bara oautentiserade anrop, så inget av det här ska nås på riktigt: ApiService
// skulle annars försöka nå kommun-API:erna, och Prisma-klienten skulle öppna SQLite-filen som en
// testkörning inte har någon anledning att röra.
//
// Anropas via `await import()` inne i mock-factoryn, eftersom `vi.mock` hissas ovanför importerna
// i testfilen och en statiskt importerad binding därför inte är initierad när factoryn definieras.

import { vi } from 'vitest';

type ImportOriginal<T> = () => Promise<T>;

export const apiServiceMock = async (importOriginal: ImportOriginal<typeof import('@/services/api.service')>) => {
  const actual = await importOriginal();
  const stub = vi.fn(() => Promise.resolve({ data: {} }));

  return {
    ...actual,
    default: class {
      get = stub;
      post = stub;
      patch = stub;
      put = stub;
      delete = stub;
    },
  };
};

export const prismaMock = () => ({
  default: {
    host: { findFirst: vi.fn(), findMany: vi.fn() },
    iDP: { findFirst: vi.fn(), findMany: vi.fn() },
  },
});
