import { pool } from '../config/db';

export const obtnenerRubros = async () => {
  try {
    const query = `SELECT * FROM rubros`;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener los rubros', error);
    return [];
  }
};
