export interface PedidoMovil {
  num_pedido: string;
  fecha_pedido: string;
  id_cliente: number;
  vendedor: string;
  facturado: false;
  estado: 'PENDIENTE' | 'SINCRONIZADO';

  items: string;
}
