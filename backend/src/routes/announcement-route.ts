import { Router } from "express";
import {
    createAnnouncementController,
    listAnnouncementsController,
    getAnnouncementController,
    updateAnnouncementController,
    deleteAnnouncementController,
} from "../controllers/announcement-controller";
import { adminAuthMiddleware } from "../middlewares/admin-middleware";

const announcementRouter = (router: Router) => {
    router.post('/announcement', adminAuthMiddleware as any, createAnnouncementController as any);
    router.get('/announcement', listAnnouncementsController);
    router.patch('/announcement', adminAuthMiddleware as any, updateAnnouncementController as any);
    router.delete('/announcement/:id', adminAuthMiddleware as any, deleteAnnouncementController as any);
};

export default announcementRouter;