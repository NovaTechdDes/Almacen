import { getDb } from './db';

export const setupDatabase = async () => {
  const conexion = await getDb();
  await conexion.execAsync('PRAGMA foreign_keys = ON');

  // const result = await conexion.getFirstAsync<{ user_version: number }>(
  //   "PRAGMA user_version",
  // );

  // if (result?.user_version === 0) {
  //   await conexion.execAsync(`
  //   ALTER TABLE clientes ADD COLUMN id_movil INTEGER;
  // `);
  //   await conexion.execAsync("PRAGMA user_version = 1");
  // }

  //Primero creamos la tabla de clientes ya que un pedido tiene que depender de un cliente

  //Verificamos si existe la tabla email
  try {
    await conexion.execAsync(`ALTER TABLE clientes ADD COLUMN email TEXT`);
  } catch (error) {
    console.info('La columna email ya existe');
  }

  try {
    await conexion.execAsync(`ALTER TABLE productos ADD COLUMN id_rubro INTEGER`);
  } catch (error) {
    console.info('La columna id_rubro ya existe');
  }

  await conexion.execAsync(`
        CREATE TABLE IF NOT EXISTS clientes (
            id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
            denominacion TEXT NOT NULL,
            dni TEXT,
            telefono TEXT,
            direccion TEXT ,
            localidad TEXT ,
            fecha_registro DATE DEFAULT CURRENT_DATE,
            id_servidor INTEGER UNIQUE,
            email TEXT
        )`);

  await conexion.execAsync(`
        CREATE TABLE IF NOT EXISTS productos (
            id_producto INTEGER PRIMARY KEY,
            descripcion TEXT NOT NULL,
            codigo TEXT,
            precio REAL NOT NULL,
            stock REAL NOT NULL,
            id_servidor INTEGER UNIQUE,
            imagen_local  TEXT,
            fecha_registro DATE DEFAULT CURRENT_DATE
        )`);

  await conexion.execAsync(`
      CREATE TABLE IF NOT EXISTS precios_mayorista (
        id_precio_mayorista INTEGER PRIMARY KEY AUTOINCREMENT,
        id_articulo INTEGER NOT NULL,
        precio_mayorista REAL,
        cant_mayorista REAL,
        FOREIGN KEY (id_articulo) REFERENCES productos(id_producto)
      )    
    `);

  await conexion.execAsync(`
    CREATE TABLE IF NOT EXISTS vendedor (
      id_vendedor INTEGER PRIMARY KEY AUTOINCREMENT,
      denominacion TEXT NOT NULL,
      clave TEXT NOT NULL,
      administrador BOOLEAN DEFAULT 0,
      id_servidor INTEGER UNIQUE
    )
    `);

  await conexion.execAsync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cliente INTEGER NOT NULL,
      fecha DATE DEFAULT CURRENT_DATE,
      importe REAL NOT NULL,
      estado TEXT NOT NULL,
      observacion TEXT,
      FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
    )
    `);

  await conexion.execAsync(`
      CREATE TABLE IF NOT EXISTS detalle_pedido (
        id_detalle_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
        id_pedido INTEGER NOT NULL,
        id_producto INTEGER NOT NULL,
        cantidad REAL NOT NULL,
        precio REAL NOT NULL,
        FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
      )`);

  await conexion.execAsync(`
        CREATE TABLE IF NOT EXISTS rubros (
          id_rubro INTEGER PRIMARY KEY,
          nom_rubro TEXT NOT NULL
        )  
      `);
};
