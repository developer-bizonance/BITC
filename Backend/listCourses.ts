import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const courses = await prisma.course.findMany({ select: { slug: true, title: true } });
    console.log(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
