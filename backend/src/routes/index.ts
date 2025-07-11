import { Router } from "express";
import authenticationRouter from "./authentication-route";
import workerRouter from "./worker-route";
import serviceRouter from "./service-route";
import bookingRouter from "./booking-route";

const router = Router();
authenticationRouter(router);
workerRouter(router);
serviceRouter(router);
bookingRouter(router);

export default router;