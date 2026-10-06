import { usePedidos } from "@/src/hooks/pedidos/usePedidos";
import { useMutateSincronizar } from "@/src/hooks/sincronizar/useMutateSincronizar";
import { mensaje } from "@/src/utils/mensaje";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Buscador from "./Buscador";

export default function HeaderPedidos() {
  const { width } = useWindowDimensions();
  const { postSincronizar } = useMutateSincronizar();
  const { data: pedidos } = usePedidos(new Date().toISOString().split("T")[0]);

  // En pantallas anchas todo va en una sola fila; en angostas se apila
  const wide = width >= 900;

  const handleSincronizar = async () => {
    const res = await postSincronizar.mutateAsync();
    if (res) {
      mensaje("success", "Sincronización exitosa");
    } else {
      mensaje("error", "Error al sincronizar");
    }
  };

  const total = pedidos?.length ?? 0;

  return (
    <View className={`pb-4 ${wide ? "pt-6 flex-row items-center justify-between gap-6" : "pt-4 gap-4"}`}>
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-shrink">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white">Pedidos</Text>
          <Text className="text-slate-500 dark:text-slate-400">
            {total} {total === 1 ? "pedido registrado" : "pedidos registrados"}
          </Text>
        </View>

        <Pressable
          onPress={handleSincronizar}
          disabled={postSincronizar.isPending}
          className={`bg-blue-500 px-4 py-2.5 rounded-xl flex-row items-center gap-2 ${postSincronizar.isPending ? "opacity-50" : ""}`}
        >
          <Ionicons name="sync-outline" size={18} color="white" />
          <Text className="text-white font-semibold">
            {postSincronizar.isPending ? "Sincronizando..." : "Sincronizar"}
          </Text>
        </Pressable>
      </View>

      <View className={wide ? "flex-1 max-w-[560px]" : ""}>
        <Buscador />
      </View>
    </View>
  );
}
