import { Request, Response } from "express";
import config from "../config/config";
import { getBookings, updateBooking } from "../services/booking-service";
import logger from "../utils/logger";
import { parse } from "path";

export async function listBookingsController(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || config.pageNumberDefault;
    const pageSize = parseInt(req.query.pageSize as string) || config.pageSizeDefault;
    try {
        const result = await getBookings(page, pageSize);
        res.json(result);
    } catch (error) {
        logger.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateBookingController(req: Request, res: Response) {
    try {
        logger.info("Updating booking with data:", req.body);
        const { id, serviceId, service, ...data } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Booking id is required" });
        }
        const updated = await updateBooking(Number(id), { ...data, service: { connect: { id: parseInt(serviceId) } } });
        logger.info("Booking updated successfully:", updated);
        res.json(updated);
    } catch (error) {
        logger.error("Error updating booking:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}