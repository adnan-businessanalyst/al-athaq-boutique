"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.getPasswordMaxAgeDays = getPasswordMaxAgeDays;
exports.isPasswordExpired = isPasswordExpired;
exports.daysUntilPasswordExpiry = daysUntilPasswordExpiry;
exports.isStrongPassword = isStrongPassword;
const argon2_1 = __importDefault(require("argon2"));
async function hashPassword(password) {
    return argon2_1.default.hash(password, { type: argon2_1.default.argon2id });
}
async function verifyPassword(hash, password) {
    try {
        return await argon2_1.default.verify(hash, password);
    }
    catch {
        return false;
    }
}
function getPasswordMaxAgeDays() {
    const raw = Number(process.env.PASSWORD_MAX_AGE_DAYS ?? "5");
    return Number.isFinite(raw) && raw > 0 ? raw : 5;
}
function isPasswordExpired(passwordChangedAt) {
    const maxMs = getPasswordMaxAgeDays() * 24 * 60 * 60 * 1000;
    return Date.now() - passwordChangedAt.getTime() > maxMs;
}
function daysUntilPasswordExpiry(passwordChangedAt) {
    const maxMs = getPasswordMaxAgeDays() * 24 * 60 * 60 * 1000;
    const remaining = maxMs - (Date.now() - passwordChangedAt.getTime());
    return Math.ceil(remaining / (24 * 60 * 60 * 1000));
}
/** Strong password: min 12, upper, lower, digit, special */
function isStrongPassword(password) {
    if (password.length < 12)
        return false;
    if (!/[a-z]/.test(password))
        return false;
    if (!/[A-Z]/.test(password))
        return false;
    if (!/[0-9]/.test(password))
        return false;
    if (!/[^A-Za-z0-9]/.test(password))
        return false;
    return true;
}
//# sourceMappingURL=password.js.map