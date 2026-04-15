import { Precio_Mayorista } from "./Precio_Mayorista";

export interface Producto {
  id_producto: number;
  codigo: string;
  descripcion: string;
  precio: number;
  precioAux: number;
  stock: number;
  precios_mayoristas: Precio_Mayorista[];
}
