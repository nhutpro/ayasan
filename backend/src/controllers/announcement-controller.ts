import { Request, Response } from "express";
import {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
} from "../services/announcement-service";
import config from "../config/config";
import logger from "../utils/logger";

export async function createAnnouncementController(req: Request, res: Response) {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const announcement = await createAnnouncement({ title, content, author });
        res.status(201).json(announcement);
    } catch (error) {
        logger.error("Error creating announcement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function listAnnouncementsController(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || config.pageNumberDefault;
    const pageSize = parseInt(req.query.pageSize as string) || config.pageSizeDefault;
    try {
        const result = await getAnnouncements(page, pageSize);
        res.json(result);
    } catch (error) {
        logger.error("Error fetching announcements:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAnnouncementController(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const announcement = await getAnnouncementById(id);
        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found" });
        }
        res.json(announcement);
    } catch (error) {
        logger.error("Error fetching announcement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateAnnouncementController(req: Request, res: Response) {
    try {
        const id = parseInt(req.body.id);
        const { title, content, author } = req.body;
        const announcement = await updateAnnouncement(id, { title, content, author });
        res.json(announcement);
    } catch (error) {
        logger.error("Error updating announcement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteAnnouncementController(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as string);
        if (!id) {
            return res.status(400).json({ error: "Announcement ID is required" });
        }
        await deleteAnnouncement(id);
        res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
        logger.error("Error deleting announcement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}