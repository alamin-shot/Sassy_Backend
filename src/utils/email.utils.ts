// backend/src/utils/email.utils.ts
import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "smtp.mailtrap.io",
  port: env.SMTP_PORT || 2525,
  auth: {
    user: env.SMTP_USER || "demo",
    pass: env.SMTP_PASS || "demo",
  },
});

const sendEmail = async (to: string, subject: string, html: string) => {
  if (!env.SMTP_HOST) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: "noreply@saasify.io", to, subject, html });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${env.CORS_ORIGIN}/reset-password/${token}`;
  await sendEmail(
    email,
    "Reset your password",
    `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  );
};

export const sendInviteEmail = async (email: string, token: string) => {
  const inviteUrl = `${env.CORS_ORIGIN}/invite?token=${token}`;
  await sendEmail(
    email,
    "You've been invited to a project",
    `<p>Click <a href="${inviteUrl}">here</a> to accept the invitation.</p>`,
  );
};
