import { getDb } from "../db/db";
import { Cliente } from "../interface";

export const getClientes = async (): Promise<Cliente[]> => {
  const db = await getDb();
  try {
    const filas = (await db.getAllAsync(`SELECT * FROM clientes`)) as Cliente[];
    return filas;
  } catch (error) {
    console.error("Error al obtener clientes", error);
    return [];
  }
};

export const postCliente = async (cliente: Cliente): Promise<boolean> => {
  const db = await getDb();
  try {
    await db.runAsync(
      `INSERT INTO clientes (denominacion, dni, telefono, direccion, localidad) VALUES (?, ?, ?, ?, ?)`,
      [
        cliente.denominacion,
        cliente.dni,
        cliente.telefono,
        cliente.direccion,
        cliente.localidad,
      ],
    );
    return true;
  } catch (error) {
    console.error("Error al obtener clientes", error);
    return false;
  }
};

export const startPutCliente = async (cliente: Cliente) => {
  const db = await getDb();
  try {
    await db.runAsync(
      `UPDATE clientes SET denominacion = ?, dni = ?, telefono = ?, direccion = ?, localidad = ? WHERE id_cliente = ?`,
      [
        cliente.denominacion,
        cliente.dni,
        cliente.telefono,
        cliente.direccion,
        cliente.localidad,
        cliente.id_cliente,
      ],
    );
    return true;
  } catch (error) {
    console.error("Error al actualizar cliente", error);
    return false;
  }
};

export const deleteCliente = async (id: string): Promise<boolean> => {
  const db = await getDb();
  try {
    await db.runAsync(`DELETE FROM clientes WHERE id_cliente = ?`, [id]);
    return true;
  } catch (error) {
    console.error("Error al eliminar cliente", error);
    return false;
  }
};
