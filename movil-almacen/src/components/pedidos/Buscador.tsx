import { usePedidoStore } from "@/src/store/pedido.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Buscador() {
  const { toggleModal } = usePedidoStore();

  return (
    <View className="flex-row gap-3 w-[50%] items-center">
      <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-lg flex-1 border-gray-200 border">
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput placeholder="Buscar pedido" className="flex-1 text-sm" />
      </View>

      <Pressable
        onPress={toggleModal}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
        className="bg-blue-600 p-3 rounded-xl flex-row items-center gap-2 shadow-lg"
      >
        <Ionicons name="add" size={22} color="white" />
        <Text className="text-white font-semibold">Nuevo Pedido</Text>
      </Pressable>
    </View>
  );
}
