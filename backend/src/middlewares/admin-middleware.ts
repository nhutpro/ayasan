import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import logger from "../utils/logger";

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info("Admin auth middleware triggered");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("No token provided");
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, config.jwtSecret) as { role?: string };
        if (payload.role !== "ADMIN") {
            logger.warn("Unauthorized access attempt");
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }
        // Optionally attach user info to req
        (req as any).user = payload;
        next();
    } catch (err: any) {
        logger.error("Token verification failed", { error: err.message });
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}