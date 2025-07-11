import { Router } from "express";
import authenticationRouter from "./authentication-route";
import workerRouter from "./worker-route";
import serviceRouter from "./service-route";
import bookingRouter from "./booking-route";
import announcementRouter from "./announcement-route";
import stripeRouter from "./stripe-route";
import mailRouter from "./mail-route";

const router = Router();
authenticationRouter(router);
workerRouter(router);
serviceRouter(router);
bookingRouter(router);
announcementRouter(router);
stripeRouter(router);
mailRouter(router);

export default router;