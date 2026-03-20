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
