import { Request, Response } from "express";
import config from "../config/config";
import { getServices, updateServicePrice } from "../services/service-service";
import logger from "../utils/logger";


export async function listServicesController(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || config.pageNumberDefault;
    const pageSize = parseInt(req.query.pageSize as string) || config.pageSizeDefault;
    const isAll = req.query.isAll === "true";
    try {
        const result = await getServices(page, pageSize, isAll);
        res.json(result);
    } catch (error) {
        logger.error("Error fetching services:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateServicePriceController(req: Request, res: Response) {
    try {
        const { id, price } = req.body;
        if (!id || typeof price !== "number") {
            return res.status(400).json({ error: "id and price are required" });
        }
        const updated = await updateServicePrice(Number(id), price);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}