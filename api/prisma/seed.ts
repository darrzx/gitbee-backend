import { statuses } from "./seed/status";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    for (let status of statuses) {
        await prisma.status.create({
            data: status
        });
    }
    console.log('Status data seeded successfully.');
}

main().catch(e => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });