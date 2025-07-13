import { Request, Response } from "express";
import { sendPaymentSuccessMail } from "../services/mail-service";
import logger from "../utils/logger";

export async function sendPaymentSuccessMailController(req: Request, res: Response) {
    try {
        const { to, customerName } = req.body;
        if (!to || !customerName) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        await sendPaymentSuccessMail(to, customerName);
        res.json({ message: "Mail sent successfully" });
    } catch (error) {
        logger.error("Error sending payment success mail:", error);
        res.status(500).json({ error: "Failed to send mail" });
    }
}