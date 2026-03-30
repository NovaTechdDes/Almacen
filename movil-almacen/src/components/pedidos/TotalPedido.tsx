import { useMutatePedidos } from "@/src/hooks/pedidos/useMutatePedido";
import { usePedidoStore } from "@/src/store/pedido.store";
import { useProductoStore } from "@/src/store/producto.store";
import { mensaje } from "@/src/utils/mensaje";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function TotalPedido() {
  const { clearPedido, total, items, cliente } = usePedidoStore();
  const { setBuscador } = useProductoStore();
  const { postPedidoMutation } = useMutatePedidos();
  const [error, setError] = useState<boolean>(false);

  const handleCreatePedido = async () => {
    if (!cliente) return setError(true);
    if (items.length === 0) return setError(true);

    const pedido = {
      importe: total,
      items,
      id_cliente: Number(cliente?.id_cliente),
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

  const onCancel = () => {
    clearPedido();
    setBuscador("");
  };

  return (
    <View>
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-slate-800">Total</Text>
        <Text className="text-3xl font-extrabold text-blue-600">
          ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </Text>
      </View>

      {error && !cliente && (
        <View className="mb-4">
          <Text className="text-red-500 font-bold">
            Debe seleccionar un cliente
          </Text>
        </View>
      )}

      {error && items.length === 0 && (
        <View className="mb-4">
          <Text className="text-red-500 font-bold">
            El pedido debe tener items
          </Text>
        </View>
      )}

      <View className="flex-row gap-4">
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
          className="flex-1 bg-white border border-slate-200 py-4 rounded-xl items-center shadow-sm shadow-slate-100"
        >
          {({ pressed }) => (
            <Text
              className={`font-bold ${
                pressed ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Cancelar
            </Text>
          )}
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
