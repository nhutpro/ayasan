import { Router } from "express";
import { sendPaymentSuccessMailController } from "../controllers/mail-controller";

const mailRouter = (router: Router) => {
    router.post('/mail/payment-success', sendPaymentSuccessMailController as any);
};

export default mailRouter;