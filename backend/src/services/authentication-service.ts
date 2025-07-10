import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { StringValue } from "ms";

const prisma = new PrismaClient();

export async function loginService(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.accessTokenExpiresIn as StringValue }
    );
    const refreshToken = jwt.sign(
        { userId: user.id },
        config.jwtRefreshSecret,
        { expiresIn: config.refreshTokenExpiresIn as StringValue }
    );

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Save refresh token in DB
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt,
        },
    });


    return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, role: user.role }
    };
}

export async function logoutService(refreshToken: string) {
    // Delete the refresh token from the database
    await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
    });
}

export async function refreshTokenService(refreshToken: string) {
    // Check if refresh token exists in DB
    const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });
    if (!tokenRecord || !tokenRecord.user) return null;

    // Verify refresh token validity
    try {
        jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch {
        return null;
    }

    // Issue new access token
    const accessToken = jwt.sign(
        { userId: tokenRecord.user.id, role: tokenRecord.user.role },
        config.jwtSecret,
        { expiresIn: config.accessTokenExpiresIn as StringValue }
    );

    return { accessToken };
}