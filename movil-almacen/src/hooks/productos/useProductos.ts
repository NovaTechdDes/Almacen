import { useQuery } from "@tanstack/react-query";
import { getProductos } from "../../actions/producto.actions";

export const useProductos = (buscador: string) => {
  return useQuery({
    queryKey: ["productos", buscador],
    queryFn: () => getProductos(buscador),
  });
};
