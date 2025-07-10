import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getWorkers(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [workers, total] = await Promise.all([
        prisma.worker.findMany({
            skip,
            take: pageSize,
            orderBy: { id: "asc" },
        }),
        prisma.worker.count(),
    ]);
    return {
        workers,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function createWorker(data: {
    name: string;
    address: string;
    phone: string;
    email: string;
    birthDate: Date;
}) {
    return prisma.worker.create({
        data,
    });
}