import { getDb } from '../db/db';
import { Producto } from '../interface';

export const actualizarProductos = async (productos: any[]) => {
  try {
    const db = await getDb();

    await db.withTransactionAsync(async () => {
      // 1. Limpiamos la tabla de precios mayoristas antes de insertar los nuevos.
      // Lo hacemos dentro de la transacción para mantener la integridad.
      await db.runAsync(`DELETE FROM precios_mayorista`);

      for (const producto of productos) {
        // 2. Insertamos o Actualizamos el producto (UPSERT)
        // Usamos ON CONFLICT para que si el id_servidor ya existe, solo actualice los datos.
        // RETURNING nos devuelve el id_producto local generado o existente.
        const res = await db.getFirstAsync<{ id_producto: number }>(
          `INSERT INTO productos (descripcion, codigo, precio, stock, id_servidor) 
           VALUES (?, ?, ?, ?, ?) 
           ON CONFLICT(id_servidor) DO UPDATE SET 
              descripcion = excluded.descripcion,
              codigo = excluded.codigo,
              precio = excluded.precio,
              stock = excluded.stock
           RETURNING id_producto`,
          [
            producto.descripcion,
            producto.codigo,
            producto.precio,
            producto.stock,
            producto.id_servidor,
          ]
        );

        const idLocalProducto = res?.id_producto;

        if (idLocalProducto) {
          // 3. Insertamos los precios mayoristas vinculados al ID local
          for (const precio of producto.precios_mayoristas) {
            await db.runAsync(
              `INSERT INTO precios_mayorista (id_articulo, precio_mayorista, cant_mayorista) VALUES (?, ?, ?)`,
              [idLocalProducto, precio.precio_mayorista, precio.cant_mayorista]
            );
          }
        }
      }
    });

    return true;
  } catch (error) {
    console.error('Error al actualizar los productos:', error);
    return false;
  }
};
