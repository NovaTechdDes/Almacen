import { Precio_Mayorista, Producto } from "./index";

export interface ProductoCarrito {
  id_producto: number;
  descripcion: string;
  precio: number;
  precioAux: number;
  cantidad: number;
  precios_mayoristas?: Precio_Mayorista[];

  producto?: Producto;
}
