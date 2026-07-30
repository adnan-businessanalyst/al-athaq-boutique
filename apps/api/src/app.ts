import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { authRouter } from "./routes/auth";
import { productsRouter } from "./routes/products";
import { newsletterRouter } from "./routes/newsletter";
import { apiRateLimit } from "./middleware/rateLimit";

function allowedOrigins(): string[] {
  const raw = process.env.FRONTEND_URL || "http://localhost:3000";
  const configured = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (/^https?:\/\//i.test(s) ? s : `https://${s}`));

  // Localhost / 127.0.0.1 are interchangeable in browsers — allow both in dev
  const extras: string[] = [];
  for (const origin of configured) {
    try {
      const u = new URL(origin);
      if (u.hostname === "localhost") {
        extras.push(`${u.protocol}//127.0.0.1${u.port ? `:${u.port}` : ""}`);
      } else if (u.hostname === "127.0.0.1") {
        extras.push(`${u.protocol}//localhost${u.port ? `:${u.port}` : ""}`);
      }
    } catch {
      /* ignore */
    }
  }

  return Array.from(new Set(configured.concat(extras)));
}

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        const allowed = allowedOrigins();
        if (!origin) return cb(null, true);
        if (allowed.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(apiRateLimit);

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "al-athaq-api" });
  });

  app.use("/auth", authRouter);
  app.use("/products", productsRouter);
  app.use("/newsletter", newsletterRouter);

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const message = err instanceof Error ? err.message : "Server error";
      if (message.startsWith("CORS blocked")) {
        return res.status(403).json({ error: message });
      }
      console.error("[api]", message);
      return res.status(500).json({ error: "Internal server error" });
    },
  );

  return app;
}
