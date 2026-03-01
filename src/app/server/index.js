import express from "express";
import cors from "cors";
import "dotenv/config";
import productosRoutes from "../../routes/productos.routes.js";
import { pool } from "../../config/db.js";

const app = express();

// CORS: GitHub Pages + local dev
app.use(
    cors({
        origin: (origin, cb) => {
            // permitir requests sin origin (Postman, curl)
            if (!origin) return cb(null, true);

            const isLocalhost =
                origin.startsWith("http://localhost:") ||
                origin.startsWith("http://127.0.0.1:");

            const isGithubPages = origin === "https://monraspgit.github.io";

            return isLocalhost || isGithubPages
                ? cb(null, true)
                : cb(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use("/api/productos", productosRoutes);

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