import { Router } from "express";
import { adminAuthMiddleware } from "../middlewares/admin-middleware";
import { listBookingsController, updateBookingController } from "../controllers/booking-controller";

const bookingRouter = (router: Router) => {
    router.get('/booking', adminAuthMiddleware as any, listBookingsController);
    router.patch('/booking', adminAuthMiddleware as any, updateBookingController as any);
};

export default bookingRouter;