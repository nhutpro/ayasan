import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getWorkers(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [workers, total] = await Promise.all([
        prisma.woker.findMany({
            skip,
            take: pageSize,
            orderBy: { id: "asc" },
        }),
        prisma.woker.count(),
    ]);
    return {
        workers,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}