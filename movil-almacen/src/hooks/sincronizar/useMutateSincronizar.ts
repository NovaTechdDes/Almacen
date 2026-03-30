import { startPostSincronizar } from "@/src/actions/sincronizar.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutateSincronizar = () => {
  const queryClient = useQueryClient();

  const postSincronizar = useMutation({
    mutationFn: startPostSincronizar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    postSincronizar,
  };
};
