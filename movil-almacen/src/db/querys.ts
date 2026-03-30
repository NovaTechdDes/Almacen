export const querysGetPedidos = `SELECT 
        p.id_pedido,
        p.id_cliente,
        p.fecha,
        p.importe,
        p.estado,
        p.observacion,

        json_object(
          'id_cliente', c.id_cliente,
          'denominacion', c.denominacion
        ) as cliente,

        (
        SELECT IFNULL(SUM(d.cantidad * d.precio), 0)
        FROM detalle_pedido d
        WHERE d.id_pedido = p.id_pedido
        ) as total,

        (
          SELECT json_group_array(
            json_object(
              'id_detalle_pedido', d.id_detalle_pedido,
              'cantidad', d.cantidad,
              'precio', d.precio,
              'subtotal', d.cantidad * d.precio,
              'producto', json_object(
                'id_producto', pr.id_producto,
                'descripcion', pr.descripcion,
                'codigo', pr.codigo
              )
            )
          )
          FROM detalle_pedido d
          JOIN productos pr ON pr.id_producto = d.id_producto
          WHERE d.id_pedido = p.id_pedido
        ) as items


       FROM pedidos p 
       JOIN clientes c ON c.id_cliente = p.id_cliente
      `;
