import { usePedidos } from "@/src/hooks/pedidos/usePedidos";
import { useMutateSincronizar } from "@/src/hooks/sincronizar/useMutateSincronizar";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Buscador from "./Buscador";

export default function HeaderPedidos() {
  const { postSincronizar } = useMutateSincronizar();
  const { data: pedidos } = usePedidos(new Date().toISOString().split("T")[0]);

  const handleSincronizar = async () => {
    await postSincronizar.mutateAsync();
  };

  return (
    <View className="bg-white py-10 px-5 flex-row justify-between">
      <View className="mb-5 flex-row justify-between gap-5">
        <View>
          <Text className="text-4xl font-bold">Pedidos</Text>
          <Text className="text-gray-500">
            {pedidos?.length} pedidos registrados
          </Text>
        </View>

        <Pressable
          onPress={handleSincronizar}
          className="bg-blue-500 px-5 py-2 rounded-lg items-center justify-center"
        >
          <Text className="text-white">Sincronizar</Text>
        </Pressable>
      </View>

      <Buscador />
    </View>
  );
}
