import { deleteCliente, postCliente } from "@/src/actions/cliente.actions";
import { Cliente } from "@/src/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutateCliente = () => {
  const queryClient = useQueryClient();

  const guardarCliente = useMutation({
    mutationFn: (cliente: Cliente) => postCliente(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });

  const eliminarCliente = useMutation({
    mutationFn: (id: string) => deleteCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });

  return {
    guardarCliente,
    eliminarCliente,
  };
};
