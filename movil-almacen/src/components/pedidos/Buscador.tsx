import { usePedidoStore } from "@/src/store/pedido.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Buscador() {
  const { toggleModal } = usePedidoStore();

  return (
    <View className="flex-row gap-3 items-center">
      <View className="flex-row items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-xl flex-1 border-slate-200 dark:border-slate-700 border">
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          placeholder="Buscar pedido"
          placeholderTextColor={"#64748b"}
          className="flex-1 ml-2 text-sm dark:text-white"
        />
      </View>

      <Pressable
        onPress={toggleModal}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
        className="bg-blue-600 px-4 py-3 rounded-xl flex-row items-center gap-1 shadow-lg"
      >
        <Ionicons name="add" size={22} color="white" />
        <Text className="text-white font-semibold">Nuevo Pedido</Text>
      </Pressable>
    </View>
  );
}
