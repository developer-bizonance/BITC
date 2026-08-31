const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const topics = ['Course Selection', 'Career Switch', 'Placement Support', 'General Career Advice'];
  for (const topic of topics) {
    const res = await prisma.inquiry.updateMany({
      where: { message: topic },
      data: { enquiryType: 'Student Consulting' }
    });
    console.log(`Updated ${res.count} for topic ${topic}`);
  }
  console.log('done');
}
main().catch(console.error).finally(() => prisma.$disconnect());
