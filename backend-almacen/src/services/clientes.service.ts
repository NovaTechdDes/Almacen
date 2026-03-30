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
      const clienteExistente = cliente?.id_movil ? await transaction.request().query(`SELECT * FROM clientes_mayorista WHERE id_cliente = '${cliente?.id_movil}'`) : null;

      if (clienteExistente && clienteExistente.recordset.length > 0) {
        //Actualizar cliente
        await transaction
          .request()
          .query(
            `UPDATE clientes_mayorista SET denominacion = '${cliente.denominacion}', dni = '${cliente.dni}', telefono = '${cliente.telefono}', direccion = '${cliente.direccion}', localidad = '${cliente.localidad}' WHERE id_movil = '${cliente.id_cliente}' and denominacion = '${cliente.denominacion}'`
          );
      } else {
        //Insertar cliente
        const result = await transaction
          .request()
          .input('denominacion', cliente.denominacion)
          .input('dni', cliente.dni)
          .input('telefono', cliente.telefono)
          .input('direccion', cliente.direccion)
          .input('localidad', cliente.localidad)
          .input('id_movil', cliente.id_cliente).query(`
            INSERT INTO clientes_mayorista
            (denominacion, dni, telefono, direccion, localidad)
            OUTPUT INSERTED.id_cliente
            VALUES
            (@denominacion, @dni, @telefono, @direccion, @localidad)`);

        cliente.id_movil = result.recordset[0].id_cliente;
      }
    }
    return clientes;
  } catch (error) {
    console.error('Error al cargar los clientes', error);
    throw error;
  }
};
