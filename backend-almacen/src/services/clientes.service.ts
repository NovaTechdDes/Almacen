import { pool, poolConnect } from '../config/db';
import { Cliente, ClienteMovil } from '../types/Cliente';

export const obtenerClientes = async () => {
  try {
    const query = `SELECT * FROM clientes ORDER BY denominacion`;

    const result = await pool.request().query(query);

    return result.recordset as Cliente[];
  } catch (error) {
    console.error('Error al obtener los clientes', error);
    return [];
  }
};

export const obtenerCliente = async (id_movil: string) => {
  try {
    const query = `SELECT * FROM clientes WHERE id_movil = '${id_movil}'`;

    const result = await pool.request().query(query);
    return result.recordset[0] as Cliente;
  } catch (error) {
    console.error('Error al obtener el cliente', error);
    return null;
  }
};

export const cargarClientes = async (transaction: any, clientes: ClienteMovil[]) => {
  try {
    for (const cliente of clientes) {
      //Buscar si hay cliente con el mismo codigo, en el servidor es  id_movil
      //Si existe se tiene que actualizar cuando la denominacion sea igual y el id sea igual
      const clienteExistente = cliente?.id_servidor ? await transaction.request().query(`SELECT * FROM clientes WHERE id_cliente = '${cliente?.id_servidor}'`) : null;

      if (clienteExistente && clienteExistente.recordset.length > 0) {
        //Actualizar cliente
        const result = await transaction
          .request()
          .input('denominacion', cliente.denominacion)
          .input('documento', cliente.documento)
          .input('telefono', cliente.telefono)
          .input('domicilio', cliente.domicilio)
          .input('id_iva', cliente.id_iva)
          .input('ctacte', cliente.ctacte)
          .input('id_servidor', cliente.id_servidor).query(`
            UPDATE clientes 
            SET denominacion = @denominacion, 
            documento = @documento, 
            tipo_doc = 'TIPO_DNI',
            telefono = @telefono, 
            domicilio = @domicilio, 
            id_iva = 2, 
            ctacte = 'Habilitada'
            OUTPUT INSERTED.id_cliente
            WHERE id_cliente = @id_servidor
            `);
        cliente.id_servidor = result.recordset[0].id_cliente;
      } else {
        //Insertar cliente
        const result = await transaction
          .request()
          .input('denominacion', cliente.denominacion)
          .input('documento', cliente.documento)
          .input('telefono', cliente.telefono)
          .input('domicilio', cliente.domicilio).query(`
            INSERT INTO clientes
            (denominacion, tipo_doc, documento, telefono, domicilio, id_iva, ctacte, id_loc)
            OUTPUT INSERTED.id_cliente
            VALUES
            (@denominacion, 'TIPO_DNI', @documento, @telefono, @domicilio, 2, 'Habilitada', 1)`);

        cliente.id_servidor = result.recordset[0].id_cliente;
      }
    }
    return clientes;
  } catch (error) {
    console.error('Error al cargar los clientes', error);
    throw error;
  }
};

export const cargarCliente = async (cliente: ClienteMovil, vendedor?: string) => {
  try {
    const result = await pool
      .request()
      .input('denominacion', cliente.denominacion)
      .input('tipo_doc', cliente.tipo_doc)
      .input('documento', cliente.documento)
      .input('telefono', cliente.telefono)
      .input('domicilio', cliente.domicilio)
      .input('id_iva', cliente.id_iva)
      .input('id_loc', cliente.id_loc)
      .input('id_movil', `${cliente.id_cliente}-${vendedor}`)
      .input('ctacte', cliente.ctacte).query(`
            INSERT INTO clientes
            (denominacion, tipo_doc, documento, telefono, domicilio, id_iva, id_loc, ctacte, id_movil)
            OUTPUT INSERTED.id_cliente
            VALUES
            (@denominacion, 'TIPO_DNI', @documento, @telefono, @domicilio, 2, 1, 'Habilitada', @id_movil)`);

    cliente.id_servidor = result.recordset[0].id_cliente;
    return cliente;
  } catch (error) {
    console.error('Error al cargar el cliente', error);
    throw error;
  }
};
