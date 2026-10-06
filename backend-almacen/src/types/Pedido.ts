export interface PedidoMovil {
  num_pedido: string;
  fecha_pedido: string;
  id_cliente: number;
  id_cliente_servidor?: number | null;
  vendedor: string;
  facturado: false;
  estado: 'PENDIENTE' | 'SINCRONIZADO';

  items: string;
}
