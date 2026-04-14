import { pool } from '../config/db';
import { Articulos } from '../types/Articulos';

export const obtenerProductos = async (): Promise<Articulos[]> => {
  try {
    const query = `
      SELECT Articulos.*, precios_mayoristas.* 
      FROM Articulos 
      INNER JOIN precios_mayoristas ON Articulos.id_articulo = precios_mayoristas.id_articulo
    `;
    const result = await pool.request().query(query);

    const productosMap = new Map<number, Articulos>();

    result.recordset.forEach((row: any) => {
      const id = row.id_articulo;

      if (!productosMap.has(id)) {
        productosMap.set(id, {
          id_producto: row.id_articulo,
          codigo: row.codigo,
          descripcion: row.descripcion,
          marca: row.marca,
          precio: row.precio,
          cantidad: row.cantidad,
          items: [],
        });
      }

      const producto = productosMap.get(id);
      if (producto) {
        producto.items?.push({
          ...row,
        });
      }
    });

    const finalProductos = Array.from(productosMap.values());
    return finalProductos;
  } catch (error) {
    console.error('Error al obtener los productos', error);
    return [];
  }
};
