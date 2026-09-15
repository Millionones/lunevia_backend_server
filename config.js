import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 4000;

export const isProd = process.env.NODE_ENV === "production";

export const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined");
}

// Cross-site cookies (sameSite:"none") require Secure + HTTPS, which localhost
// over plain http cannot satisfy — so in dev we relax to lax/non-secure so the
// admin session actually persists. See controllers/auth.controller.js.
export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

export const frontendUrls = [
  "https://www.lunevia.in",
  "https://lunevia.vercel.app",
  "http://localhost:3000",
  ...(isProd ? [] : ["http://localhost:3001"]),
];
