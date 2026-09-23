interface ProductoBackEnd {
  id_articulo: number;
  codigo: string;
  descripcion: string;
  marca: string;
  id_rubro: number;
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

export const productoMapper = (producto: ProductoBackEnd, serverUrl?: string | null) => {
  let imagenUrl = producto.imagenURL || '';

  // Si la URL es relativa (/imagenes/...), le anteponemos la dirección del servidor configurada
  if (imagenUrl && !imagenUrl.startsWith('http://') && !imagenUrl.startsWith('https://') && serverUrl) {
    const limpiaServer = serverUrl.replace(/\/+$/, '');
    const limpiaRuta = imagenUrl.startsWith('/') ? imagenUrl : `/${imagenUrl}`;
    imagenUrl = `http://${limpiaServer}${limpiaRuta}`;
  }

  return {
    descripcion: producto.descripcion,
    codigo: producto.codigo,
    precio: producto.precio ?? 0,
    id_rubro: producto.id_rubro,
    stock: producto.cantidad ?? 0,
    id_articulo: producto.id_articulo,
    imagen_local: imagenUrl,

    precios_mayoristas: producto.precios_mayoristas,
  };
};
