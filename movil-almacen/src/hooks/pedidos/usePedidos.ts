import { useQuery } from "@tanstack/react-query";
import { getPedidos } from "../../actions/pedido.actions";

export const usePedidos = (fecha: string) => {
  return useQuery({
    queryKey: ["pedidos", fecha],
    queryFn: () => getPedidos(fecha),
  });
};
