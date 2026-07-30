import { createApp } from "./app";

const port = Number(process.env.PORT || 4000);

try {
  // Fail fast if JWT_SECRET missing in production-minded runs
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    console.warn(
      "[api] JWT_SECRET is missing or too short — set a strong secret before production use.",
    );
  }
} catch {
  /* noop */
}

const app = createApp();

app.listen(port, () => {
  console.log(`Al Athaq API listening on http://localhost:${port}`);
});
