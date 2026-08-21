import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.course.findMany({ select: { slug: true, fees: true, price: true } }).then(console.log).finally(() => prisma.$disconnect());
