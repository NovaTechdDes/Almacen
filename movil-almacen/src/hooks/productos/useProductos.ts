import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getProductos, getProductosForRubro } from '../../actions/producto.actions';

export const useProductoInfinito = (buscador: string, limit: number, rubro: number) => {
  return useInfiniteQuery({
    queryKey: ['productos-infinito', buscador, rubro],
    queryFn: ({ pageParam }) => getProductos(buscador, limit, pageParam, rubro),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.length === limit ? allPages.length * limit : undefined,
  })
}

export const useProductos = (buscador: string, limit: number, offset: number, rubro: number) => {
  return useQuery({
    queryKey: ['productos', buscador, offset, rubro],
    queryFn: () => getProductos(buscador, limit, offset, rubro),
  });
};

export const useProductoForRubro = (rubroId: number, buscador: string) => {
  return useQuery({
    queryKey: ['productos', rubroId, buscador],
    queryFn: () => getProductosForRubro(rubroId, buscador),
  });
};
