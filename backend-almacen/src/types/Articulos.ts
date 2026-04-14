import { Detalle_Pedido } from './detalle_pedido';

export interface Articulos {
  id_producto: number;
  codigo?: string;
  descripcion: string;
  marca: string;
  precio: number;
  cantidad: number;

  preciosMayoristas?: Detalle_Pedido[];
}
