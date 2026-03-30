import { PedidoItemMovil } from './Items';

export interface PedidoMovil {
  id_cliente: number;
  fecha: string;
  importe: number;
  estado: string;
  observacion: string;
  id_vendedor: number;
  id_pedido: number;

  items: string;
}
