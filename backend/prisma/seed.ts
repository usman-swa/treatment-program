// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const weeksData = {
    "week36": [
      { weekday: 'MONDAY', title: 'The Meru Health Program', completed: false },
      { weekday: 'WEDNESDAY', title: 'Introduction to the Program', completed: true },
      { weekday: 'FRIDAY', title: 'The Science Behind Mindfulness', completed: true }
    ],
    "week37": [
      { weekday: 'MONDAY', title: 'Mind on Autopilot', completed: true },
      { weekday: 'WEDNESDAY', title: 'Mindful Presence', completed: false },
      { weekday: 'FRIDAY', title: 'Consequences of Autopilot', completed: false }
    ],
    "week38": [
      { weekday: 'MONDAY', title: 'The Negativity Spiral', completed: false },
      { weekday: 'WEDNESDAY', title: 'Spiral of Negative Interpretations', completed: false },
      { weekday: 'FRIDAY', title: 'Interrupting the Negativity Spiral', completed: false }
    ]
  };

  for (const [week, activities] of Object.entries(weeksData)) {
    await prisma.treatmentProgram.createMany({
      data: activities.map(activity => ({
        week,
        ...activity
      }))
    });
  }

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