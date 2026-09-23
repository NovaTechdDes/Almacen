import { getDb } from '../db/db';
import { Rubro } from '../interface';

export const actualizarRubros = async (rubros: Rubro[]) => {
  try {
    const db = await getDb();

    await db.withTransactionAsync(async () => {
      for (const rubro of rubros) {
        await db.runAsync(`INSERT INTO rubros (id_rubro, nom_rubro) VALUES (?, ?) ON CONFLICT(id_rubro) DO UPDATE SET nom_rubro = excluded.nom_rubro`, [rubro.id_rubro, rubro.nom_rubro]);
      }
    });

    return true;
  } catch (error) {
    console.error('Error al actualizar los rubros:', error);
    return false;
  }
};
