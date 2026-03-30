import { startPostSincronizar } from "@/src/actions/sincronizar.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutateSincronizar = () => {
  const queryClient = useQueryClient();

  const postSincronizar = useMutation({
    mutationFn: async () => {
      const res = await startPostSincronizar();
      if (res) {
        queryClient.invalidateQueries({ queryKey: ["clientes"] });
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      }
    },
  });

  return {
    postSincronizar,
  };
};
