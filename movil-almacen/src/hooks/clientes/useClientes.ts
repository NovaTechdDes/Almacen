import { useQuery } from "@tanstack/react-query";
import { getClientes } from "../../actions/cliente.actions";

export const useClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });
};
