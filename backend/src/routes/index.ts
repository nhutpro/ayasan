import { Router } from "express";
import authenticationRouter from "./authentication-route";
import workerRouter from "./worker-route";

const router = Router();
authenticationRouter(router);
workerRouter(router);

export default router;