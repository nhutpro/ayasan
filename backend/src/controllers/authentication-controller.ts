import { Request, Response } from "express";
import { loginService, logoutService } from "../services/authentication-service";
import logger from "../utils/logger";

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await loginService(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(result);

  } catch (error) {
    logger.error("Error occurred during login", { error });
    res.status(500).json({ error: "Internal server error" });
  }

}

export async function logoutController(req: Request, res: Response) {
  try {
    // Expect refreshToken in body or cookie
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }
    await logoutService(refreshToken);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Error occurred during logout", { error });
    res.status(500).json({ error: "Internal server error" });
  }
}
