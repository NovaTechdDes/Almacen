import { Precio_Mayorista } from './Precio_Mayorista';

export interface Articulos {
  id_producto: number;
  descripcion: string;
  codigo?: string;
  precio: number;
  stock: number;

  preciosMayoristas?: Precio_Mayorista[];
}
