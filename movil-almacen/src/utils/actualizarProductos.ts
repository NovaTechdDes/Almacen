import { getDb } from '../db/db';

export const actualizarProductos = async (productos: any[]) => {
  try {
    const db = await getDb();

    await db.withTransactionAsync(async () => {
      // 1. Limpiamos los precios mayoristas viejos
      await db.runAsync(`DELETE FROM precios_mayorista`);

      // 2. Preparamos las sentencias SQL una sola vez para máxima velocidad
      const stmtProducto = await db.prepareAsync(`
        INSERT INTO productos (descripcion, codigo, precio, id_rubro, stock, id_producto, imagen_local) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(id_producto) DO UPDATE SET 
          descripcion = excluded.descripcion,
          codigo = excluded.codigo,
          precio = excluded.precio,
          id_rubro = excluded.id_rubro,
          stock = excluded.stock,
          id_producto = excluded.id_producto,
          -- Si ya teníamos una imagen local descargada (file://), la conservamos; si no, usamos la URL recibida
          imagen_local = CASE 
            WHEN productos.imagen_local LIKE 'file://%' THEN productos.imagen_local
            WHEN excluded.imagen_local IS NOT NULL AND excluded.imagen_local != '' THEN excluded.imagen_local
            ELSE productos.imagen_local
          END
      `);

      const stmtPrecio = await db.prepareAsync(`
        INSERT INTO precios_mayorista (id_articulo, precio_mayorista, cant_mayorista) 
        VALUES (?, ?, ?)
      `);

      try {
        for (const producto of productos) {
          const imagenAInsertar = producto.imagen_local || '';

          // Ejecutamos la inserción usando la sentencia preparada (súper veloz)
          await stmtProducto.executeAsync([
            producto.descripcion,
            producto.codigo,
            producto.precio,
            producto.id_rubro,
            producto.stock,
            producto.id_articulo,
            imagenAInsertar,
          ]);

          // Insertamos sus precios mayoristas usando directamente producto.id_articulo
          if (producto.precios_mayoristas && producto.precios_mayoristas.length > 0) {
            for (const precio of producto.precios_mayoristas) {
              await stmtPrecio.executeAsync([
                producto.id_articulo,
                precio.precio_mayorista,
                precio.cant_mayorista,
              ]);
            }
          }
        }
      } finally {
        // Liberamos las sentencias preparadas de memoria
        await stmtProducto.finalizeAsync();
        await stmtPrecio.finalizeAsync();
      }
    });

    return true;
  } catch (error) {
    console.error('Error al actualizar los productos:', error);
    return false;
  }
};
