import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.course.update({
      where: { slug: "human-resource" },
      data: { title: "Human Resource" }
    });
    console.log("Successfully updated course:", updated.title);
  } catch (error) {
    console.error("Error updating course:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
