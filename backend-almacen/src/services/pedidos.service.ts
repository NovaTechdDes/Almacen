import { ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';

export const cargarPedidos = async (transaction: any, pedidos: PedidoMovil[], clientes: ClienteMovil[]) => {
  try {
    for (const pedido of pedidos) {
      if (pedido.estado !== 'PENDIENTE') continue;
      //Los pedidos que vienen, que van a ser pedidos nuevos, de estado PENDIENTE CARGARLOS
      pedido.estado = 'SINCRONIZADO';

      console.log(pedidos);
      const cliente = clientes.find((c) => c.id_cliente === pedido.id_cliente);

      if (!cliente) {
        console.error('Cliente no encontrado', pedido.id_cliente);
        continue;
      } else {
        pedido.id_cliente = cliente.id_movil;
      }

      //Insertar Pedido
      const result = await transaction
        .request()
        .input('id_cliente', cliente.id_movil)
        .input('importe', pedido.importe)
        .input('estado', pedido.estado)
        .input('observacion', pedido.observacion)
        .input('id_vendedor', 1).query(`
          INSERT INTO pedidos 
          (id_cliente, importe, estado, id_vendedor, observacion) 
          OUTPUT INSERTED.id_pedido
          VALUES (@id_cliente, @importe, @estado, @id_vendedor, @observacion)`);

      //Insertar Items del pedido

      for (const item of JSON.parse(pedido.items)) {
        await transaction.request().input('id_pedido', result.recordset[0].id_pedido).input('id_producto', item.producto.id_producto).input('cantidad', item.cantidad).input('precio', item.precio)
          .query(`
            INSERT INTO item_pedido (id_pedido, id_producto, cantidad, precio)
            VALUES (@id_pedido, @id_producto, @cantidad, @precio)`);
      }
    }

    return pedidos;
  } catch (error) {
    console.error('Error al cargar los pedidos', error);
    throw error;
  }
};
