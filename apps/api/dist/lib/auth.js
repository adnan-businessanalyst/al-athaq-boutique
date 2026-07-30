"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAME = void 0;
exports.signSession = signSession;
exports.verifySession = verifySession;
exports.setSessionCookie = setSessionCookie;
exports.clearSessionCookie = clearSessionCookie;
exports.readSessionToken = readSessionToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const COOKIE_NAME = "al_athaq_admin_session";
exports.COOKIE_NAME = COOKIE_NAME;
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 16) {
        throw new Error("JWT_SECRET must be set (min 16 characters)");
    }
    return secret;
}
function signSession(payload) {
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), {
        expiresIn: "8h",
        issuer: "al-athaq-api",
    });
}
function verifySession(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret(), {
            issuer: "al-athaq-api",
        });
        if (!decoded?.sub || !decoded?.email)
            return null;
        return { sub: decoded.sub, email: decoded.email };
    }
    catch {
        return null;
    }
}
function setSessionCookie(res, token) {
    const secure = process.env.NODE_ENV === "production";
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/",
        maxAge: 8 * 60 * 60 * 1000,
    });
}
function clearSessionCookie(res) {
    const secure = process.env.NODE_ENV === "production";
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/",
    });
}
function readSessionToken(req) {
    const fromCookie = req.cookies?.[COOKIE_NAME];
    if (typeof fromCookie === "string" && fromCookie.length > 0)
        return fromCookie;
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
        return header.slice(7).trim() || null;
    }
    return null;
}
//# sourceMappingURL=auth.js.map