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
        CREATE TABLE IF NOT EXISTS productos (
            id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcion TEXT NOT NULL,
            codigo TEXT,
            precio REAL NOT NULL,
            stock REAL NOT NULL,
            fecha_registro DATE DEFAULT CURRENT_DATE
        )`);

  await conexion.execAsync(`
      CREATE TABLE IF NOT EXISTS precio_mayorista (
        id_precio_mayorista INTEGER PRIMARY KEY AUTOINCREMENT,
        id_producto INTEGER NOT NULL,
        precio REAL NOT NULL,
        fecha_registro DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
      )    
    `);

  await conexion.execAsync(`
    CREATE TABLE IF NOT EXISTS vendedor (
      id_vendedor INTEGER PRIMARY KEY AUTOINCREMENT,
      denominacion TEXT NOT NULL,
      clave TEXT NOT NULL,
      administrador BOOLEAN DEFAULT 0
    )
    `);
};
