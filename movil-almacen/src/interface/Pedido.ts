import { Cliente } from "./Cliente";
import { ProductoCarrito } from "./ProductoCarrito";

export interface Pedido {
  id_cliente: number;
  fecha: string;
  importe: number;
  estado: string;
  observacion?: string;
  id_vendedor?: string;
  id_pedido?: number;

  items?: ProductoCarrito[];
  cliente?: Cliente;
}
