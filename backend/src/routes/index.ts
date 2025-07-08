import { Router } from "express";
import authenticationRouter from "./authentication-route";

const router = Router();
authenticationRouter(router);

export default router;