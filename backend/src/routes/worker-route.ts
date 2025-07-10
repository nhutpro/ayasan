import { Router } from "express";
import { listWorkersController } from "../controllers/worker-controller";
import { adminAuthMiddleware } from "../middlewares/admin-middleware";

const workerRouter = (router: Router) => {
    router.get('/worker', adminAuthMiddleware as any, listWorkersController);
};

export default workerRouter;