import { Router } from "express";
import { createWorkerController, listWorkersController } from "../controllers/worker-controller";
import { adminAuthMiddleware } from "../middlewares/admin-middleware";

const workerRouter = (router: Router) => {
    router.get('/worker', adminAuthMiddleware as any, listWorkersController);
    router.post('/worker', adminAuthMiddleware as any, createWorkerController as any);
};

export default workerRouter;