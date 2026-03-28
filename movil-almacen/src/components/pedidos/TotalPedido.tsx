import { useMutatePedidos } from "@/src/hooks/pedidos/useMutatePedido";
import { usePedidoStore } from "@/src/store/pedido.store";
import { mensaje } from "@/src/utils/mensaje";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function TotalPedido() {
  const { clearPedido, total, items, cliente } = usePedidoStore();
  const { postPedidoMutation } = useMutatePedidos();

  const handleCreatePedido = async () => {
    if (!cliente) return;
    const pedido = {
      importe: total,
      items,
      id_cliente: Number(cliente.id_cliente),
      fecha: new Date().toISOString(),
      estado: "PENDIENTE",
    };
    const res = await postPedidoMutation.mutateAsync(pedido);

    if (res) {
      mensaje("success", "Pedido creado exitosamente");
      clearPedido();
    } else {
      mensaje("error", "Error al crear el pedido");
    }
  };

  return (
    <View>
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-slate-800">Total</Text>
        <Text className="text-3xl font-extrabold text-blue-600">
          ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View className="flex-row gap-4">
        <Pressable
          onPress={clearPedido}
          className="flex-1 bg-white border border-slate-200 py-4 rounded-xl items-center shadow-sm shadow-slate-100"
        >
          <Text className="text-slate-600 font-bold">Cancelar</Text>
        </Pressable>
        <Pressable
          disabled={postPedidoMutation.isPending}
          onPress={handleCreatePedido}
          className="flex-[1.5] bg-blue-500 py-4 rounded-xl items-center shadow-md shadow-blue-200"
        >
          <Text className="text-white font-bold text-lg">
            {postPedidoMutation.isPending ? "Creando..." : "Crear Pedido"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
