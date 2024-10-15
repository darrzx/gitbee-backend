import { categories } from "./seeds/category";
import { statuses } from "./seeds/status";
import { technologies } from "./seeds/technology";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.status.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.technology.deleteMany({});

    await prisma.$executeRaw`ALTER TABLE status AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE category AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE technology AUTO_INCREMENT = 1`;

    // Seed statuses
    await prisma.status.createMany({
        data: statuses
    });
    console.log('Status data seeded successfully.');

    // Seed categories
    await prisma.category.createMany({
        data: categories
    });
    console.log('Category data seeded successfully.');

    // Seed technologies
    await prisma.technology.createMany({
        data: technologies
    });
    console.log('Technology data seeded successfully.');
}

main().catch(e => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });