// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.treatmentProgram.createMany({
    data: [
      { weekday: 'MONDAY', title: 'The Meru Health Program', completed: false },
      { weekday: 'WEDNESDAY', title: 'Introduction to the Program', completed: true },
      { weekday: 'FRIDAY', title: 'The Science Behind Mindfulness', completed: true },
      // Add more data as needed
    ],
  });

  console.log('Seed data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
