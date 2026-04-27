import { getDb } from '../db/db';
import { Rubro } from '../interface';

export const getRubros = async (): Promise<Rubro[]> => {
  try {
    const db = await getDb();
    return (await db.getAllAsync(`SELECT * FROM rubros order by nom_rubro ASC`)) as Rubro[];
  } catch (error) {
    console.error('Error al obtener rubros', error);
    return [];
  }
};
