import { getDb } from '../db/db';

export const actualizarProductos = async (productos: any[], rutas?: string[]) => {
  try {
    const db = await getDb();

    await db.withTransactionAsync(async () => {
      // 1. Limpiamos la tabla de precios mayoristas antes de insertar los nuevos.
      // Lo hacemos dentro de la transacción para mantener la integridad.
      await db.runAsync(`DELETE FROM precios_mayorista`);

      for (const producto of productos) {
        const imagenLocal = rutas?.find((ruta) => ruta.includes(producto.codigo));

        // 2. Insertamos o Actualizamos el producto (UPSERT)
        // Usamos ON CONFLICT para que si el id_servidor ya existe, solo actualice los datos.
        // RETURNING nos devuelve el id_producto local generado o existente.
        await db.runAsync(
          `INSERT INTO productos (descripcion, codigo, precio, stock, id_producto, imagen_local) 
          VALUES (?, ?, ?, ?, ?, ?) 
          ON CONFLICT(id_producto) DO UPDATE SET 
          descripcion = excluded.descripcion,
          codigo = excluded.codigo,
          precio = excluded.precio,
          stock = excluded.stock,
          id_producto = excluded.id_producto,
          imagen_local = excluded.imagen_local`,

          [producto.descripcion, producto.codigo, producto.precio, producto.stock, producto.id_articulo, imagenLocal]
        );

        // 2️⃣ Obtenemos el id local por separado
        const res = await db.getFirstAsync<{ id_producto: number }>(`SELECT id_producto FROM productos WHERE id_producto = ?`, [producto.id_articulo]);

        const idLocalProducto = res?.id_producto;

        if (idLocalProducto) {
          // 3. Insertamos los precios mayoristas vinculados al ID local
          for (const precio of producto.precios_mayoristas) {
            await db.runAsync(`INSERT INTO precios_mayorista (id_articulo, precio_mayorista, cant_mayorista) VALUES (?, ?, ?)`, [idLocalProducto, precio.precio_mayorista, precio.cant_mayorista]);
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
