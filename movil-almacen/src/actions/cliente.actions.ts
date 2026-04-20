import { getDb } from '../db/db';
import { Cliente } from '../interface';

export const getClientes = async (): Promise<Cliente[]> => {
  const db = await getDb();
  try {
    const filas = (await db.getAllAsync(`SELECT * FROM clientes`)) as Cliente[];
    return filas;
  } catch (error) {
    console.error('Error al obtener clientes', error);
    return [];
  }
};

export const postCliente = async (cliente: Cliente): Promise<boolean> => {
  const db = await getDb();
  try {
    await db.runAsync(`INSERT INTO clientes (denominacion, dni, telefono, direccion, localidad, email) VALUES (?, ?, ?, ?, ?, ?)`, [
      cliente.denominacion,
      cliente.dni,
      cliente.telefono,
      cliente.direccion,
      cliente.localidad ?? null,
      cliente.email ?? null,
    ]);
    return true;
  } catch (error) {
    console.error('Error al crear clientes', error);
    return false;
  }
};

export const startPutCliente = async (cliente: Cliente) => {
  const db = await getDb();
  try {
    await db.runAsync(`UPDATE clientes SET denominacion = ?, dni = ?, telefono = ?, direccion = ?, localidad = ?, email = ? WHERE id_cliente = ?`, [
      cliente.denominacion,
      cliente.dni,
      cliente.telefono,
      cliente.direccion,
      cliente.localidad ?? null,
      cliente.email ?? null,
      cliente.id_cliente ?? null,
    ]);
    return true;
  } catch (error) {
    console.error('Error al actualizar cliente', error);
    return false;
  }
};

export const deleteCliente = async (id: string): Promise<boolean> => {
  const db = await getDb();
  try {
    await db.runAsync(`DELETE FROM clientes WHERE id_cliente = ?`, [id]);
    return true;
  } catch (error) {
    console.error('Error al eliminar cliente', error);
    return false;
  }
};
