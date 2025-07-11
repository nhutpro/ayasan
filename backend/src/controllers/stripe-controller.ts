import { Request, Response } from "express";
import { constructStripeEvent, createStripeSession, handleStripeEvent } from "../services/stripe-service";
import logger from "../utils/logger";

export async function createStripePaymentController(req: Request, res: Response) {
    try {
        const { amount, currency, ...bookingInfo } = req.body;
        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }
        const session = await createStripeSession(amount, currency, bookingInfo);
        res.json({ session });
    } catch (error) {
        logger.error("Error creating Stripe payment session:", error);
        res.status(500).json({ error: "Stripe payment failed" });
    }
}



export async function stripeWebhookController(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
        event = constructStripeEvent(req.body, sig);

    } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Delegate event handling to the service
    handleStripeEvent(event);

    res.json({ received: true });
}