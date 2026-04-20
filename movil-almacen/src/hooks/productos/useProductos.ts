import { useQuery } from '@tanstack/react-query';
import { getProductos } from '../../actions/producto.actions';

export const useProductos = (buscador: string, limit: number, offset: number, rubro: number) => {
  return useQuery({
    queryKey: ['productos', buscador, offset, rubro],
    queryFn: () => getProductos(buscador, limit, offset, rubro),
  });
};
