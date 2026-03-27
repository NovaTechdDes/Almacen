import { getDb } from "../db/db";
import { Producto } from "../interface";

export const getProductos = async (): Promise<Producto[]> => {
  const db = await getDb();
  try {
    const filas = (await db.getAllAsync(
      `SELECT 
        p.id_producto,
        p.descripcion,
        p.codigo,
        p.precio,
        p.stock,
        (SELECT json_group_array(
          json_object(
            'id_precio_mayorista', id_precio_mayorista,
            'id_producto', id_producto,
            'precio', precio
          )
        ) FROM precio_mayorista WHERE id_producto = p.id_producto) as precios_mayoristas
      FROM productos p
      ORDER BY p.descripcion
      LIMIT 20;`,
    )) as any[];

    return filas.map((fila) => ({
      ...fila,
      precios_mayoristas: JSON.parse(fila.precios_mayoristas || "[]"),
    })) as Producto[];
  } catch (error) {
    console.error("Error al obtener productos", error);
    return [];
  }
};
