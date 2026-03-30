import { pool } from '../config/db';

export const obtenerVendedores = async () => {
  try {
    const query = `SELECT * FROM vendedor`;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener los vendedores', error);
    return [];
  }
};
