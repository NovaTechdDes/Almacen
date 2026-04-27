import { useQuery } from '@tanstack/react-query';
import { getProductos, getProductosForRubro } from '../../actions/producto.actions';

export const useProductos = (buscador: string, limit: number, offset: number, rubro: number) => {
  return useQuery({
    queryKey: ['productos', buscador, offset, rubro],
    queryFn: () => getProductos(buscador, limit, offset, rubro),
  });
};

export const useProductoForRubro = (rubroId: number) => {
  return useQuery({
    queryKey: ['productos', rubroId],
    queryFn: () => getProductosForRubro(rubroId),
  });
};
