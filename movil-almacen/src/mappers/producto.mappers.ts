interface ProductoBackEnd {
  id_articulo: number;
  codigo: string;
  descripcion: string;
  marca: string;
  precio: number;
  cantidad: number;
  imagenURL: string;
  precios_mayoristas: {
    id_precio: number;
    id_articulo: number;
    cant_mayorista: number;
    precio_mayorista: number;
  }[];
}

export const productoMapper = (producto: ProductoBackEnd) => {
  return {
    descripcion: producto.descripcion,
    codigo: producto.codigo,
    precio: producto.precio ?? 0,
    stock: producto.cantidad ?? 0,
    id_articulo: producto.id_articulo,
    imagen_local: producto.imagenURL,

    precios_mayoristas: producto.precios_mayoristas,
  };
};
