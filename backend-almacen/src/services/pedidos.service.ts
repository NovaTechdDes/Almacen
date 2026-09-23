import { Cliente, ClienteMovil } from '../types/Cliente';
import { PedidoMovil } from '../types/Pedido';
import { cargarCliente, obtenerCliente } from './clientes.service';

export const cargarPedidos = async (transaction: any, pedidos: PedidoMovil[], clientesTablet: ClienteMovil[] | Cliente[]) => {
  try {
    for (const pedido of pedidos) {
      
      // 1. Obtener o registrarel cliente si no existe
      let cliente = await obtenerCliente(`${pedido.id_cliente}-${pedido.vendedor}`);
      
      if (!cliente) {
        const clienteTraido = clientesTablet.find((c) => c.id_cliente === pedido.id_cliente);
        if (clienteTraido) {
          cliente = await cargarCliente(clienteTraido as ClienteMovil, pedido.vendedor);
        }
      } else {
        cliente.id_servidor = cliente.id_cliente;
      }

      // 2. Insertar cabecera del pedido
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

      const idPedidoGenerado = result.recordset[0]?.id_pedido;
      
      // 3. Insercion en LOTE (Batch) de los items en una sola consulta SQL
      if (pedido.items && idPedidoGenerado) {

        const items = JSON.parse(pedido.items);
        if(items.length > 0){
          const req = transaction.request();
          req.input('id_pedido', idPedidoGenerado);

          const valuesClauses = items.map((item: any,  idx: number) => {
            req.input(`id_art_${idx}`, item.producto.id_producto);
            req.input(`cant_${idx}`, item.cantidad);
            req.input(`precio_${idx}`, item.precio);

            return `(@id_pedido, @id_art_${idx}, @cant_${idx}, @precio_${idx})`;
          }).join(',\n');


          await req.query(`
            INSERT INTO detalle_pedido (id_pedido, id_articulo, cant_pedido, precio_pedido)
            VALUES ${valuesClauses}`)
        };
      }
    }

    return pedidos;
  } catch (error) {
    console.error('Error al cargar los pedidos', error);
    throw error;
  }
};
