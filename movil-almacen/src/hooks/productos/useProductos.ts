import { useQuery } from "@tanstack/react-query";
import { getProductos } from "../../actions/producto.actions";

export const useProductos = () => {
  return useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });
};
