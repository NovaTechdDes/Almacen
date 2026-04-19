import { getDb } from '../db/db';
import { Rubro } from '../interface';

export const actualizarRubros = async (rubros: Rubro[]) => {
  try {
    const db = await getDb();

    await db.withTransactionAsync(async () => {
      for (const rubro of rubros) {
        const rubroExistente = await db.getFirstAsync(`SELECT * FROM rubros where id_rubro = ?`, [rubro.id_rubro]);

        if (rubroExistente) {
          await db.runAsync(`UPDATE rubros SET nom_rubro = ? WHERE id_rubro = ?`, [rubro.nom_rubro, rubro.id_rubro]);
        } else {
          await db.runAsync(`INSERT INTO rubros (id_rubro, nom_rubro) VALUES (?, ?)`, [rubro.id_rubro, rubro.nom_rubro]);
        }
      }
    });
  } catch (error) {
    console.error('Error al actualizar los rubros:', error);
    return false;
  }
};
