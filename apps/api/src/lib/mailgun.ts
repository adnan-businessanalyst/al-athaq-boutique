import formData from "form-data";
import Mailgun from "mailgun.js";

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function isConfigured(): boolean {
  return Boolean(
    process.env.MAILGUN_API_KEY &&
      process.env.MAILGUN_DOMAIN &&
      process.env.MAILGUN_FROM,
  );
}

export async function sendMail(args: SendArgs): Promise<{ sent: boolean; skipped?: boolean }> {
  if (!isConfigured()) {
    console.warn("[mailgun] skipped — MAILGUN_* env not fully configured");
    return { sent: false, skipped: true };
  }

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });

  await client.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: process.env.MAILGUN_FROM!,
    to: [args.to],
    subject: args.subject,
    text: args.text,
    html: args.html ?? `<p>${args.text}</p>`,
  });

  return { sent: true };
}

export async function notifyLogin(email: string) {
  return sendMail({
    to: email,
    subject: "Al Athaq Boutique — admin login",
    text: `A successful admin login was recorded for ${email} at ${new Date().toISOString()}.`,
  });
}

export async function notifyPasswordChanged(email: string) {
  return sendMail({
    to: email,
    subject: "Al Athaq Boutique — password changed",
    text: `Your admin password was changed at ${new Date().toISOString()}. If this wasn't you, reset access immediately.`,
  });
}

export async function notifyPasswordExpiring(email: string, daysRemaining: number) {
  return sendMail({
    to: email,
    subject: "Al Athaq Boutique — password expires soon",
    text: `Your admin password expires in ${daysRemaining} day(s). Please change it from the control panel.`,
  });
}

export async function notifyNewsletterSignup(email: string) {
  return sendMail({
    to: process.env.MAILGUN_FROM || email,
    subject: "Newsletter signup",
    text: `New newsletter signup: ${email}`,
  });
}
