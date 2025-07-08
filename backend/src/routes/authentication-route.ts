import { Router } from "express";
import { loginController, logoutController } from "../controllers/authentication-controller";

const authenticationRouter = (router: Router) => {
  router.post('/login', loginController as any);

  router.post('/logout', logoutController as any);
};

export default authenticationRouter;
