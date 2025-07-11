import prisma from "../../prisma";
import { formatYMDToDMY, getUTC_HHmm, utcToYYYYMMDD } from "../utils/functions";

export async function getBookings(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [pureBookings, total] = await Promise.all([
        prisma.booking.findMany({
            skip,
            take: pageSize,
            orderBy: { id: "asc" },
            include: { service: true },
        }),
        prisma.booking.count(),
    ]);
   
    const bookings = pureBookings.map(booking => ({
        ...booking,
        to: getUTC_HHmm(booking.to.toISOString()),
        date: utcToYYYYMMDD(booking.date.toISOString()),
        from: getUTC_HHmm(booking.from.toISOString())
    }));
    return {
        bookings,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function updateBooking(id: number, data: any) {
    return prisma.booking.update({
        where: { id },
        data,
    });
}