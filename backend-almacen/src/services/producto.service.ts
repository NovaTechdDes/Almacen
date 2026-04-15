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
        (
            SELECT 
                pm.id_precio,
                pm.id_articulo,
                pm.cant_mayorista,
                pm.precio_mayorista
            FROM precios_mayoristas pm
            WHERE pm.id_articulo = a.id_articulo
            FOR JSON PATH
        ) AS precios_mayoristas
    FROM articulos a
    ORDER BY a.codigo
    `;
    const result = await pool.request().query(query);

    const articulos = result.recordset.map((row) => ({
      ...row,
      precios_mayoristas: row.precios_mayoristas ? JSON.parse(row.precios_mayoristas) : [],
    }));

    const articulosConImagen = obtenerDireccionImage(articulos);

    return articulosConImagen;
  } catch (error) {
    console.error('Error al obtener los productos', error);
    return [];
  }
};
