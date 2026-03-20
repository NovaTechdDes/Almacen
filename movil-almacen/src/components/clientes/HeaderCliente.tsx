import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function HeaderCliente() {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center">
        <View className="flex-1 px-1">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white">
            Clientes
          </Text>
          <Text className="text-slate-500 dark:text-slate-400">
            Gestiona tu cartera de clientes
          </Text>
        </View>
        <View className="ml-4">
          <Pressable className="flex-row items-center bg-indigo-600 px-4 py-2.5 rounded-2xl shadow-sm active:opacity-80">
            <Ionicons name="add" size={22} color="#fff" />
            <Text className="text-white font-bold ml-1">Nuevo Cliente</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
