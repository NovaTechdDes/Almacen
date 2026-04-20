import { Precio_Mayorista } from './Precio_Mayorista';
import { Rubro } from './Rubro';

export interface Producto {
  id_producto: number;
  codigo: string;
  descripcion: string;
  id_rubro: number;
  precio: number;
  imagen_local: string;
  precioAux: number;
  stock: number;
  precios_mayoristas: Precio_Mayorista[];

  rubro?: Rubro;
}
