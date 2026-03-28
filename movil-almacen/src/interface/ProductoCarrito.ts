import { Producto } from "./Producto";

export interface ProductoCarrito {
  id_producto: number;
  descripcion: string;
  precio: number;
  cantidad: number;

  producto?: Producto;
}
