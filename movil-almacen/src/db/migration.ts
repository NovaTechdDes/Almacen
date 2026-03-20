import { getDb } from "./db";

export const setupDatabase = async () => {
  const conexion = await getDb();
  await conexion.execAsync("PRAGMA foreign_keys = ON");

  //Primero creamos la tabla de clientes ya que un pedido tiene que depender de un cliente
  await conexion.execAsync(`
        CREATE TABLE IF NOT EXISTS clientes (
            id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
            denominacion TEXT NOT NULL,
            dni TEXT,
            telefono TEXT,
            direccion TEXT ,
            localidad TEXT ,
            fecha_registro DATE DEFAULT CURRENT_DATE
        )`);
};
