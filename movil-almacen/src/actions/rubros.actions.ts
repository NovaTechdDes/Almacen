import { getDb } from '../db/db';

export const getRubros = async () => {
  try {
    const db = await getDb();
    return await db.getAllAsync(`SELECT * FROM rubros`);
  } catch (error) {
    console.error('Error al obtener rubros', error);
    return [];
  }
};
