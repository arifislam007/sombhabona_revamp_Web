import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
  }
  return transporter;
}

export async function notifyStaff(subject: string, text: string) {
  const client = getTransporter();
  const to = process.env.NOTIFY_EMAIL;
  if (!client || !to) {
    // SMTP not configured (e.g. local dev) — skip silently rather than failing the request.
    return;
  }
  await client.sendMail({
    from: process.env.SMTP_USER ?? "no-reply@sombhabona.org",
    to,
    subject,
    text,
  });
}
