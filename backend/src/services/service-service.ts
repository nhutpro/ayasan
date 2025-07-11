import prisma from "../../prisma";


export async function getServices(page: number, pageSize: number, isAll: boolean = false) {
    if (isAll) {
        const services = await prisma.service.findMany({
            orderBy: { id: "asc" },
        });
        return {
            services
        }
    }
    const skip = (page - 1) * pageSize;
    const [services, total] = await Promise.all([
        prisma.service.findMany({
            skip,
            take: pageSize,
            orderBy: { id: "asc" },
        }),
        prisma.service.count(),
    ]);
    return {
        services,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}


export async function updateServicePrice(id: number, price: number) {
    return prisma.service.update({
        where: { id },
        data: { price },
    });
}