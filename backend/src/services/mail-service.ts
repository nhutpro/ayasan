import nodemailer from "nodemailer";
import logger from "../utils/logger";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, // your Hotmail/Outlook address
        pass: process.env.MAIL_PASS, // your Hotmail/Outlook password
    },
});

export async function sendPaymentSuccessMail(to: string, customerName: string) {
    logger.info(`Sending payment success mail to ${to}`);
    const html = `
        <h2>Payment Successful!</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for your payment . Your transaction was successful.</p>
        <p>We appreciate your business!</p>
        <hr>
        <p>Ayasan Team</p>
    `;
    return transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: "Payment Success - Ayasan",
        html,
    });
}