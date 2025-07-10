import { Request, Response } from "express";
import { getWorkers } from "../services/worker-service";
import logger from "../utils/logger";
import config from "../config/config";

export async function listWorkersController(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || config.pageNumberDefault;
    const pageSize = parseInt(req.query.pageSize as string) || config.pageSizeDefault;
    try {
        const result = await getWorkers(page, pageSize);
        res.json(result);
    } catch (error) {
        logger.error("Error fetching workers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}