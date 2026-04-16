import { pool } from '../config/db';
import { Articulos } from '../types/Articulos';
import { obtenerDireccionImage } from '../utils/obtenerDireccionImage';

export const obtenerProductos = async (): Promise<Articulos[]> => {
  try {
    const query = `
     SELECT 
        a.id_articulo, 
        a.codigo, 
        a.descripcion, 
        a.marca, 
        a.precio, 
        a.cantidad, 
        pm.id_precio,
        pm.cant_mayorista,
        pm.precio_mayorista
    FROM articulos a
    INNER JOIN precios_mayoristas pm ON a.id_articulo = pm.id_articulo
    ORDER BY a.codigo
    `;
    const result = await pool.request().query(query);

    const articulosMap = new Map();

    for (const row of result.recordset) {
      if (!articulosMap.has(row.id_articulo)) {
        articulosMap.set(row.id_articulo, {
          id_articulo: row.id_articulo,
          codigo: row.codigo,
          descripcion: row.descripcion,
          marca: row.marca,
          precio: row.precio,
          cantidad: row.cantidad,
          precios_mayoristas: [],
        });
      }
    }

    const articulos = Array.from(articulosMap.values());

    const articulosConImagen = obtenerDireccionImage(articulos);

    return articulosConImagen;
  } catch (error) {
    console.error('Error al obtener los productos', error);
    return [];
  }
};
