"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
exports.notifyLogin = notifyLogin;
exports.notifyPasswordChanged = notifyPasswordChanged;
exports.notifyPasswordExpiring = notifyPasswordExpiring;
exports.notifyNewsletterSignup = notifyNewsletterSignup;
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
function isConfigured() {
    return Boolean(process.env.MAILGUN_API_KEY &&
        process.env.MAILGUN_DOMAIN &&
        process.env.MAILGUN_FROM);
}
async function sendMail(args) {
    if (!isConfigured()) {
        console.warn("[mailgun] skipped — MAILGUN_* env not fully configured");
        return { sent: false, skipped: true };
    }
    const mailgun = new mailgun_js_1.default(form_data_1.default);
    const client = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
    });
    await client.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.MAILGUN_FROM,
        to: [args.to],
        subject: args.subject,
        text: args.text,
        html: args.html ?? `<p>${args.text}</p>`,
    });
    return { sent: true };
}
async function notifyLogin(email) {
    return sendMail({
        to: email,
        subject: "Al Athaq Boutique — admin login",
        text: `A successful admin login was recorded for ${email} at ${new Date().toISOString()}.`,
    });
}
async function notifyPasswordChanged(email) {
    return sendMail({
        to: email,
        subject: "Al Athaq Boutique — password changed",
        text: `Your admin password was changed at ${new Date().toISOString()}. If this wasn't you, reset access immediately.`,
    });
}
async function notifyPasswordExpiring(email, daysRemaining) {
    return sendMail({
        to: email,
        subject: "Al Athaq Boutique — password expires soon",
        text: `Your admin password expires in ${daysRemaining} day(s). Please change it from the control panel.`,
    });
}
async function notifyNewsletterSignup(email) {
    return sendMail({
        to: process.env.MAILGUN_FROM || email,
        subject: "Newsletter signup",
        text: `New newsletter signup: ${email}`,
    });
}
//# sourceMappingURL=mailgun.js.map