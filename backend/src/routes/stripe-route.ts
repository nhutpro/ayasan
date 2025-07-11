import { Router } from "express";
import { createStripePaymentController } from "../controllers/stripe-controller";

const stripeRouter = (router: Router) => {
    router.post('/stripe/payment', createStripePaymentController as any);
};

export default stripeRouter;