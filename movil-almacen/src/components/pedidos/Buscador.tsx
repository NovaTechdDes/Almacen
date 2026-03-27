import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Buscador() {
  return (
    <View className="flex-row gap-3 w-[50%] items-center">
      <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-lg flex-1 border-gray-200 border">
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput placeholder="Buscar pedido" className="flex-1 text-sm" />
      </View>

      <Pressable className="bg-blue-500 p-2 rounded-lg flex-row items-center gap-2">
        <Ionicons name="add" size={20} color="white" />
        <Text className="text-white">Nuevo Pedido</Text>
      </Pressable>
    </View>
  );
}
