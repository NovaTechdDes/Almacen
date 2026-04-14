import { ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';

export const cargarPedidos = async (transaction: any, pedidos: PedidoMovil[], clientes: ClienteMovil[]) => {
  try {
    for (const pedido of pedidos) {
      if (pedido.estado !== 'PENDIENTE') continue;
      //Los pedidos que vienen, que van a ser pedidos nuevos, de estado PENDIENTE CARGARLOS
      pedido.estado = 'SINCRONIZADO';

      const cliente = clientes.find((c) => c.id_cliente === pedido.id_cliente);

      if (!cliente) {
        console.error('Cliente no encontrado', pedido.id_cliente);
        continue;
      } else {
        pedido.id_cliente = cliente.id_servidor;
      }

      //Insertar Pedido
      const result = await transaction
        .request()
        .input('id_cliente', cliente.id_servidor)
        .input('estado', pedido.estado)
        .input('vendedor', pedido.vendedor)
        .input('num_pedido', pedido.num_pedido)
        .input('fecha_pedido', pedido.fecha_pedido).query(`
          INSERT INTO pedidos 
          (id_cliente, estado, vendedor, num_pedido, fecha_pedido, facturado) 
          OUTPUT INSERTED.id_pedido
          VALUES (@id_cliente, @estado, @vendedor, @num_pedido, @fecha_pedido, 0)`);

      //Insertar Items del pedido

      for (const item of JSON.parse(pedido.items)) {
        await transaction.request().input('id_pedido', result.recordset[0].id_pedido).input('id_producto', item.producto.id_producto).input('cantidad', item.cantidad).input('precio', item.precio)
          .query(`
            INSERT INTO detalle_pedido (id_pedido, id_articulo, cant_pedido, precio_pedido)
            VALUES (@id_pedido, @id_producto, @cantidad, @precio)`);
      }
    }

    return pedidos;
  } catch (error) {
    console.error('Error al cargar los pedidos', error);
    throw error;
  }
};
