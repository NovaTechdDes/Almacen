import { Pedido } from "@/src/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startDeletePedido,
  startPostPedido,
  startPutPedido,
} from "../../actions/pedido.actions";

export const useMutatePedidos = () => {
  const queryClient = useQueryClient();

  const postPedidoMutation = useMutation({
    mutationFn: (pedido: Pedido) => startPostPedido(pedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });

  const putPedidoMutation = useMutation({
    mutationFn: (pedido: Pedido) => startPutPedido(pedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });

  const deletePedidoMutation = useMutation({
    mutationFn: (id: number) => startDeletePedido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });

  return {
    postPedidoMutation,
    putPedidoMutation,
    deletePedidoMutation,
  };
};
