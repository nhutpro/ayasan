import { Router } from "express";
import { adminAuthMiddleware } from "../middlewares/admin-middleware";
import { listServicesController, updateServicePriceController } from "../controllers/service-controller";

const serviceRouter = (router: Router) => {
    router.get('/service', adminAuthMiddleware as any, listServicesController);
    router.patch('/service', adminAuthMiddleware as any, updateServicePriceController as any);
};

export default serviceRouter;