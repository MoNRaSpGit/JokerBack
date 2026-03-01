import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "../../config/db.js";

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
app.get("/health", async (_req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");
        res.status(200).json({
            ok: true,
            service: "joker-back",
            db: rows?.[0]?.ok === 1 ? "up" : "unknown",
            ts: Date.now(),
        });
    } catch (e) {
        res.status(500).json({
            ok: false,
            service: "joker-back",
            db: "down",
            error: e?.message || "db error",
            ts: Date.now(),
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Joker API running on :${PORT}`);


    try {
        await pool.query("SELECT 1");
        console.log("✅ DB conectada con éxito");
    } catch (error) {
        console.error("❌ Error conectando a DB:", {
            code: error.code,
            message: error.message,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            db: process.env.DB_NAME,
        });
    }
});