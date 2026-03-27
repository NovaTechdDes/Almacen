export interface Producto {
  id_producto: number;
  codigo: string;
  descripcion: string;
  precio: number;
  stock: number;
  precios_mayoristas: PrecioMayorista[];
}

export interface PrecioMayorista {
  id_precio_mayorista: number;
  id_producto: number;
  precio: number;
}
