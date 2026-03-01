import { pool } from "../config/db.js";

export async function listProductos({ limit = 100 } = {}) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200));

  const [rows] = await pool.query(
    `
    SELECT
      id,
      tipo,
      nombre,
      descripcion,
      estado,
      precio,
      moneda,
      maneja_stock,
      stock,
      stock_min,
      barcode,
      imagen_mime,
      imagen_bytes,
      imagen_sha256,
      updated_at
    FROM joker_productos
    ORDER BY id DESC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows;
}