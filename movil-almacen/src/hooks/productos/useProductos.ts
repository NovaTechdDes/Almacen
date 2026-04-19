import { useQuery } from '@tanstack/react-query';
import { getProductos } from '../../actions/producto.actions';

export const useProductos = (buscador: string, limit: number, offset: number) => {
  return useQuery({
    queryKey: ['productos', buscador, offset],
    queryFn: () => getProductos(buscador, limit, offset),
  });
};
