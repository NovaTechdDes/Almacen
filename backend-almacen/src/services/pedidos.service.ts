import { Cliente, ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';
import { cargarCliente, obtenerCliente } from './clientes.service';

export const cargarPedidos = async (transaction: any, pedidos: PedidoMovil[], clientesTablet: ClienteMovil[] | Cliente[]) => {
  try {
    for (const pedido of pedidos) {
      //Los pedidos que vienen, que van a ser pedidos nuevos, de estado PENDIENTE CARGARLOS

      let cliente = await obtenerCliente(`${pedido.id_cliente}-${pedido.vendedor}`);
      if (!cliente) {
        const clienteTraido = clientesTablet.find((c) => c.id_cliente === pedido.id_cliente);
        if (clienteTraido) {
          cliente = await cargarCliente(clienteTraido as ClienteMovil, pedido.vendedor);
        }
      } else {
        cliente.id_servidor = cliente.id_cliente;
      }

      //Insertar Pedido
      const result = await transaction
        .request()
        .input('id_cliente', cliente?.id_servidor)
        .input('vendedor', pedido.vendedor)
        .input('num_pedido', pedido.num_pedido)
        .input('fecha_pedido', pedido.fecha_pedido).query(`
          INSERT INTO pedidos 
          (id_cliente, vendedor, num_pedido, fecha_pedido, facturado) 
          OUTPUT INSERTED.id_pedido
          VALUES (@id_cliente, @vendedor, @num_pedido, @fecha_pedido, 0)`);

      //Insertar Items del pedido

      console.log(JSON.parse(pedido.items));

      if (pedido.items) {
        for (const item of JSON.parse(pedido.items)) {
          await transaction.request().input('id_pedido', result.recordset[0].id_pedido).input('id_articulo', item.producto.id_producto).input('cantidad', item.cantidad).input('precio', item.precio)
            .query(`
            INSERT INTO detalle_pedido (id_pedido, id_articulo, cant_pedido, precio_pedido)
            VALUES (@id_pedido, @id_articulo, @cantidad, @precio)`);
        }
      }
    }

    return pedidos;
  } catch (error) {
    console.error('Error al cargar los pedidos', error);
    throw error;
  }
};
