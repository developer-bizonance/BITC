import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.inquiry.findMany().then(console.log).finally(() => prisma.$disconnect());
