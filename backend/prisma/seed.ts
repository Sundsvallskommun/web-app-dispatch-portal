import { PrismaClient } from '@prisma-generated/postgresql';
import { PrismaClient as SqlitePrismaClient } from '@prisma-generated/sqlite';
const prisma =
  process.env.DATABASE_PROVIDER === 'postgresql'
    ? new PrismaClient()
    : (new SqlitePrismaClient() as unknown as PrismaClient);
async function main() {
  const idp = await prisma.iDP.upsert({
    where: { id: 1 },
    update: {},
    create: {
      entryPoint: process.env.SAML_ENTRY_SSO,
      idpCert: process.env.SAML_IDP_PUBLIC_CERT,
    },
  });

  const sundsvall = await prisma.host.upsert({
    where: { name: 'sundsvall' },
    update: {},
    create: {
      municipalityId: 2281,
      name: 'sundsvall',
      idpId: 1,
    },
  });

  console.log(idp, sundsvall);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
