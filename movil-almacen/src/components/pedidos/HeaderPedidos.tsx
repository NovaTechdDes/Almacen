import { usePedidos } from "@/src/hooks/pedidos/usePedidos";
import { useMutateSincronizar } from "@/src/hooks/sincronizar/useMutateSincronizar";
import { mensaje } from "@/src/utils/mensaje";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Buscador from "./Buscador";

export default function HeaderPedidos() {
  const { postSincronizar } = useMutateSincronizar();
  const { data: pedidos } = usePedidos(new Date().toISOString().split("T")[0]);

  const handleSincronizar = async () => {
    const res = await postSincronizar.mutateAsync();
    if (res) {
      mensaje("success", "Sincronización exitosa");
    } else {
      mensaje("error", "Error al sincronizar");
    }
  };

  return (
    <View className="bg-white dark:bg-slate-900 py-10 px-5 flex-row justify-between transition-colors">
      <View className="mb-5 flex-row justify-between gap-5">
        <View>
          <Text className="text-4xl font-bold text-slate-900 dark:text-white">Pedidos</Text>
          <Text className="text-gray-500 dark:text-slate-400">
            {pedidos?.length} pedidos registrados
          </Text>
        </View>

        <Pressable
          onPress={handleSincronizar}
          className={`bg-blue-500 px-5 py-2 rounded-lg items-center justify-center ${postSincronizar.isPending ? "opacity-50" : ""}`}
        >
          <Text className="text-white">
            {postSincronizar.isPending ? "Sincronizando..." : "Sincronizar"}
          </Text>
        </Pressable>
      </View>

      <Buscador />
    </View>
  );
}
