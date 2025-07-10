import { Router } from "express";
import { loginController, logoutController, refreshTokenController } from "../controllers/authentication-controller";

const authenticationRouter = (router: Router) => {
  router.post('/login', loginController as any);
  router.post('/logout', logoutController as any);
  router.post('/refresh', refreshTokenController as any);
}

export default authenticationRouter;
