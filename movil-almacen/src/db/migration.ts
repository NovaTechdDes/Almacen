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

  await conexion.execAsync(`
          INSERT INTO clientes (denominacion, dni, telefono, direccion, localidad) VALUES
          ('Juan Perez', '12345678', '123456789', 'Calle 1', 'Ciudad 1'),
          ('Maria Lopez', '87654321', '987654321', 'Calle 2', 'Ciudad 2'),
          ('Pedro Rodriguez', '12345678', '123456789', 'Calle 3', 'Ciudad 3')`);
};
