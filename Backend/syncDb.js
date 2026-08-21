import { PrismaClient } from '@prisma/client';
import { courses } from './src/data/courses.js';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting DB sync for courses...");
  let count = 0;
  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        fees: course.fees,
        price: course.price,
        duration: course.duration,
        description: course.description
      },
      create: {
        slug: course.slug,
        title: course.title,
        category: course.category,
        duration: course.duration,
        fees: course.fees,
        price: course.price,
        description: course.description,
        features: course.features,
        image: course.image || "",
      }
    });
    count++;
  }
  console.log(`Successfully synced ${count} courses to DB with correct prices.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
