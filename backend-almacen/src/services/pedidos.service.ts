import { ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';

export const cargarPedidos = async (transaction: any, pedidos: PedidoMovil[], clientes: ClienteMovil[]) => {
  try {
    for (const pedido of pedidos) {
      if (pedido.estado !== 'PENDIENTE') continue;
      //Los pedidos que vienen, que van a ser pedidos nuevos, de estado PENDIENTE CARGARLOS
      pedido.estado = 'SINCRONIZADO';

      const cliente = clientes.find((c) => c.id_movil === pedido.id_cliente);

      if (!cliente) {
        console.error('Cliente no encontrado', pedido.id_cliente);
        continue;
      } else {
        pedido.id_cliente = cliente.id_movil;
      }

      //Insertar Pedido
      await transaction
        .request()
        .query(
          `INSERT INTO pedidos (id_cliente, importe, estado, observacion, id_vendedor) VALUES ('${pedido.id_cliente}', '${pedido.importe}', '${pedido.estado}', '${pedido.observacion}', '${pedido.id_vendedor}')`
        );

      //Insertar Items del pedido
      console.log(pedido.items);
      for (const item of pedido.items) {
        await transaction
          .request()
          .query(`INSERT INTO item_pedido (id_pedido, id_producto, cantidad, precio) VALUES ('${item.id_pedido}', '${item.id_producto}', '${item.cantidad}', '${item.precio}')`);
      }
    }

    return pedidos;
  } catch (error) {
    console.error('Error al cargar los pedidos', error);
    throw error;
  }
};
