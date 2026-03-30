import { pool, poolConnect } from '../config/db';
import { Cliente, ClienteMovil } from '../types/Cliente';

export const obtenerClientes = async () => {
  try {
    const query = `SELECT * FROM clientes_mayorista ORDER BY denominacion`;

    const result = await pool.request().query(query);

    return result.recordset as Cliente[];
  } catch (error) {
    console.error('Error al obtener los clientes', error);
    return [];
  }
};

export const cargarClientes = async (transaction: any, clientes: ClienteMovil[]) => {
  try {
    for (const cliente of clientes) {
      //Buscar si hay cliente con el mismo codigo, en el servidor es  id_movil
      //Si existe se tiene que actualizar cuando la denominacion sea igual y el id sea igual
      const clienteExistente = await transaction.request().query(`SELECT * FROM clientes_mayorista WHERE id_movil = '${cliente.id}'`);

      if (clienteExistente.recordset.length > 0) {
        //Actualizar cliente
        await transaction
          .request()
          .query(
            `UPDATE clientes_mayorista SET denominacion = '${cliente.denominacion}', dni = '${cliente.dni}', telefono = '${cliente.telefono}', direccion = '${cliente.direccion}', localidad = '${cliente.localidad}' WHERE id_movil = '${cliente.id}' and denominacion = '${cliente.denominacion}'`
          );
      } else {
        //Insertar cliente
        await transaction
          .request()
          .query(
            `INSERT INTO clientes_mayorista (denominacion, dni, telefono, direccion, localidad, id_movil) VALUES ('${cliente.denominacion}', '${cliente.dni}', '${cliente.telefono}', '${cliente.direccion}', '${cliente.localidad}', '${cliente.id}')`
          );
      }
    }
    return clientes;
  } catch (error) {
    console.error('Error al cargar los clientes', error);
    throw error;
  }
};
