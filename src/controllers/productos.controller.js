import { listProductos } from "../service/productos.service.js";

export async function getProductos(req, res) {
  try {
    const limit = req.query.limit;
    const items = await listProductos({ limit });

    return res.status(200).json({ ok: true, items });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "db error" });
  }
}