import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import router from "./routes";
const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/', router);
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

export default app;