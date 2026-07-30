import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function getPasswordMaxAgeDays(): number {
  const raw = Number(process.env.PASSWORD_MAX_AGE_DAYS ?? "5");
  return Number.isFinite(raw) && raw > 0 ? raw : 5;
}

export function isPasswordExpired(passwordChangedAt: Date): boolean {
  const maxMs = getPasswordMaxAgeDays() * 24 * 60 * 60 * 1000;
  return Date.now() - passwordChangedAt.getTime() > maxMs;
}

export function daysUntilPasswordExpiry(passwordChangedAt: Date): number {
  const maxMs = getPasswordMaxAgeDays() * 24 * 60 * 60 * 1000;
  const remaining = maxMs - (Date.now() - passwordChangedAt.getTime());
  return Math.ceil(remaining / (24 * 60 * 60 * 1000));
}

/** Strong password: min 12, upper, lower, digit, special */
export function isStrongPassword(password: string): boolean {
  if (password.length < 12) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}
