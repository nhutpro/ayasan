import { Request, Response } from "express";
import { createWorker, getWorkers } from "../services/worker-service";
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

export async function createWorkerController(req: Request, res: Response) {
    try {
        logger.info("Creating worker with data:", req.body);
        const { name, address, phone, email, birthDate } = req.body;
        if (!name || !address || !phone || !email || !birthDate) {
            logger.warn("Missing required fields for worker creation");
            return res.status(400).json({ error: "All fields are required" });
        }
        const worker = await createWorker({ name, address, phone, email, birthDate: new Date(birthDate) });
        logger.info("Worker created successfully:", worker);
        res.status(201).json(worker);
    } catch (error) {
        logger.error("Error creating worker:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}