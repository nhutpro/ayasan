import express, { Router } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import router from "./routes";
import stripeRouter from "./routes/stripe-route";
import { stripeWebhookController } from "./controllers/stripe-controller";
const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.post(
    "/api/stripe/webhook",
    // Stripe requires the raw body for signature verification
    express.raw({ type: "application/json" }),
    stripeWebhookController as any
);
app.use(express.json());
app.use('/api', router);
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

export default app;