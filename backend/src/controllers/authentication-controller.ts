import { Request, Response } from "express";
import { loginService, logoutService, refreshTokenService } from "../services/authentication-service";
import logger from "../utils/logger";

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    logger.info("Login attempt", { email });
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await loginService(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    logger.info("Login successful", { userId: result.user.id });
    res.json(result);

  } catch (error) {
    logger.error("Error occurred during login", { error });
    res.status(500).json({ error: "Internal server error" });
  }

}

export async function logoutController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    logger.info("Logout attempt");
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }
    await logoutService(refreshToken);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    logger.info("Logout successful");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Error occurred during logout", { error });
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function refreshTokenController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const result = await refreshTokenService(refreshToken);
    if (!result) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    res.json(result);
  } catch (error) {
    logger.error("Error occurred during token refresh", { error });
    res.status(500).json({ error: "Internal server error" });
  }
}
