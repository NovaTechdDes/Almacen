import { getDb } from '../db/db';
import { Cliente } from '../interface';

export const actualizarClientes = async (clientes: Cliente[]) => {
  console.log(clientes[0]);
  try {
    const db = await getDb();
    await db.withTransactionAsync(async () => {
      const stmt = await db.prepareAsync(`
                INSERT INTO clientes (denominacion, dni, telefono, direccion, localidad, id_servidor)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id_servidor) DO UPDATE SET
                    denominacion = excluded.denominacion,
                    dni = excluded.dni,
                    telefono = excluded.telefono,
                    direccion = excluded.direccion,
                    localidad = excluded.localidad    
            `);

      try {
        for (const cliente of clientes) {
          if (!cliente.id_servidor) continue;

          await stmt.executeAsync([cliente.denominacion, cliente.dni || '', cliente.telefono || '', cliente.direccion || '', cliente.localidad || '', cliente.id_servidor]);
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar clientes:', error);
    return false;
  }
};
