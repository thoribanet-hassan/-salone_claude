import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";

const COOKIE = "salon_session";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

// ===== تشفير كلمات المرور (scrypt — بلا مكتبات خارجية) =====
export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string | null): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(pw, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ===== جلسة موقّعة (HMAC) في كوكي =====
export interface SessionData {
  userId: string;
  shopId: string;
  role: Role;
  name: string;
}

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function encodeSession(s: SessionData): string {
  const payload = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string): SessionData | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig || sign(payload) !== sig) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  return c ? decodeSession(c) : null;
}

export async function setSession(s: SessionData): Promise<void> {
  (await cookies()).set(COOKIE, encodeSession(s), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
