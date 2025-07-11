import { connect } from "http2";
import Stripe from "stripe";
import prisma from "../../prisma";
import logger from "../utils/logger";
import { sendPaymentSuccessMail } from "./mail-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createStripeSession(amount: number, currency: string = "usd", bookingInfo: any) {
    return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: bookingInfo.serviceName // Include booking info in product data
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/failure`,
        metadata: {
            ...bookingInfo
        }
    });
}

export function constructStripeEvent(payload: Buffer | string, sig: string) {
    return stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
    );
}

export async function handleStripeEvent(event: Stripe.Event) {
    switch (event.type) {
        case "checkout.session.completed":
            logger.info("Checkout session completed:", event.data.object);
            try {
                const { serviceId, serviceName, ...bookingInfo } = event.data.object.metadata as any;

                await prisma.booking.create({
                    data: {
                        ...bookingInfo,
                        service: {
                            connect: { id: parseInt(serviceId) }
                        }
                    }
                });
                await sendPaymentSuccessMail(
                    bookingInfo.email,
                    bookingInfo.customerName
                );
                logger.info("Booking created successfully");
            } catch (error) {
                logger.error("Error processing checkout session:", error);
            }

            break;
        // ...handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
}