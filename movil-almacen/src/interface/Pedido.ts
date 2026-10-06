import { Cliente } from './Cliente';
import { ProductoCarrito } from './ProductoCarrito';

export interface Pedido {
  id_cliente: number;
  fecha: string;
  importe: number;
  estado: string;
  observacion?: string;
  id_pedido?: number;
  id_cliente_servidor?: number | null; // id real del cliente en el servidor, si ya está sincronizado

  items?: ProductoCarrito[];
  cliente?: Cliente;
}
