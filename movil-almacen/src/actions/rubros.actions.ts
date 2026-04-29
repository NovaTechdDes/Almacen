import { getDb } from '../db/db';
import { Rubro } from '../interface';

export const getRubros = async (): Promise<Rubro[]> => {
  try {
    const db = await getDb();
    return (await db.getAllAsync(`
      SELECT r.id_rubro, r.nom_rubro, COUNT(p.id_producto) AS cantidad_productos
      FROM rubros r
      LEFT JOIN productos p ON r.id_rubro = p.id_rubro GROUP BY r.id_rubro ORDER BY r.nom_rubro ASC `)) as Rubro[];
  } catch (error) {
    console.error('Error al obtener rubros', error);
    return [];
  }
};
