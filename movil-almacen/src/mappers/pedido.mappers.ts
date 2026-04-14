import { Pedido } from "../interface";

export const pedidoMapperBackEnd = (pedido: Pedido) => {
  return {
    num_pedido: pedido.id_pedido,
    fecha_pedido: pedido.fecha,
    id_cliente: pedido.id_cliente,
    vendedor: pedido.id_vendedor,
    facturado: false,
  };
};
