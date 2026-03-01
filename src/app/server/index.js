import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

// CORS: GitHub Pages + local dev
const allowedOrigins = [
  "http://localhost:5173",
  "https://monraspgit.github.io",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // permitir requests sin origin (Postman, curl)
      if (!origin) return cb(null, true);

      const ok =
        allowedOrigins.includes(origin) ||
        origin.startsWith("https://monraspgit.github.io");

      return ok ? cb(null, true) : cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "joker-back", ts: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Joker API running on :${PORT}`));