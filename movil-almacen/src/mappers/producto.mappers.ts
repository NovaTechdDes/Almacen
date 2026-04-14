interface ProductoBackEnd {
  id_articulo: number;
  codigo: string;
  descripcion: string;
  marca: string;
  precio: number;
  cantidad: number;
}

export const productoMapper = (producto: ProductoBackEnd) => {
  return {
    descripcion: producto.descripcion,
    codigo: producto.codigo,
    precio: producto.precio,
    stock: producto.cantidad,
    id_servidor: producto.id_articulo,
  };
};
