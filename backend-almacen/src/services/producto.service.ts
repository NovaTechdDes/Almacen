import { pool } from '../config/db';

export const obtenerProductos = async () => {
  try {
    const query = `SELECT * FROM Articulos`;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener los productos', error);
    return [];
  }
};
