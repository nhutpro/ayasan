import prisma from "../../prisma";

export async function createAnnouncement(data: { title: string; content: string; author: string }) {
    return prisma.announcement.create({ data });
}

export async function getAnnouncements(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [announcements, total] = await Promise.all([
        prisma.announcement.findMany({
            skip,
            take: pageSize,
            orderBy: { id: "asc" },
        }),
        prisma.announcement.count(),
    ]);
    return {
        announcements,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function getAnnouncementById(id: number) {
    return prisma.announcement.findUnique({ where: { id } });
}

export async function updateAnnouncement(id: number, data: { title?: string; content?: string; author?: string }) {
    return prisma.announcement.update({
        where: { id },
        data,
    });
}

export async function deleteAnnouncement(id: number) {
    return prisma.announcement.delete({ where: { id } });
}