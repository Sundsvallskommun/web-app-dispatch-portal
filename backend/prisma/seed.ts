import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const logotype = await prisma.logotype.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Sundsvalls kommuns logotyp',
      filenameLightMode: 'symbol-lightmode.svg',
      urlLightMode: '/files/symbol-lightmode.svg',
      filenameDarkMode: 'symbol-darkmode.svg',
      urlDarkMode: '/files/symbol-darkmode.svg',
    },
  });

  const kommun = await prisma.municipality.upsert({
    where: { municipalityId: 2281 },
    update: {},
    create: {
      municipalityId: 2281,
      name: 'Sundsvalls kommun',
      logotypeId: 1,
    },
  });

  const org = await prisma.organization.upsert({
    where: { host: 'postportal.sundsvall.se' },
    update: {},
    create: {
      host: 'https://postportal.sundsvall.se',
      name: 'Sundsvalls kommun',
      orgId: 13,
      municipalityId: 2281,
      logotypeId: 1,
    },
  });
  const localhost = await prisma.organization.upsert({
    where: { host: 'localhost' },
    update: {},
    create: {
      host: 'http://localhost:3000',
      name: 'Utvecklingskommun',
      orgId: 13,
      municipalityId: 2281,
      logotypeId: 1,
    },
  });
  console.log(logotype, kommun, org, localhost);
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
