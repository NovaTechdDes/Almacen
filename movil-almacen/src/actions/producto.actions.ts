import { getDb } from '../db/db';
import { Producto } from '../interface';

export const getProductos = async (buscador: string, limit: number = 20, offset: number = 0): Promise<Producto[]> => {
  const db = await getDb();
  try {
    const filas = (await db.getAllAsync(
      `SELECT 
        p.id_producto,
        p.descripcion,
        p.codigo,
        p.precio,
        p.stock,
        p.imagen_local,
        (SELECT json_group_array(
          json_object(
            'id_precio_mayorista', id_precio_mayorista,
            'id_articulo', id_articulo,
            'precio_mayorista', precio_mayorista,
            'cant_mayorista', cant_mayorista
          )
        ) FROM precios_mayorista WHERE id_articulo = p.id_producto) as precios_mayoristas
      FROM productos p
      WHERE p.descripcion LIKE ? OR p.codigo LIKE ?
      ORDER BY p.descripcion
      LIMIT ? OFFSET ?;`,
      [`%${buscador}%`, `%${buscador}%`, limit, offset]
    )) as any[];

    return filas.map((fila) => ({
      ...fila,
      precios_mayoristas: JSON.parse(fila.precios_mayoristas || '[]'),
    })) as Producto[];
  } catch (error) {
    console.error('Error al obtener productos', error);
    return [];
  }
};
