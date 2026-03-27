import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function ListaVacia() {
  return (
    <View className="flex-1 items-center justify-center p-10 min-h-[400px]">
      <View className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-full mb-8">
        <Ionicons name="receipt-outline" size={80} color="#94a3b8" />
      </View>

      <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        No se encontraron pedidos
      </Text>

      <Text className="text-slate-500 text-center text-lg max-w-[300px] leading-6">
        Crea un nuevo pedido para comenzar a gestionar tus ventas.
      </Text>
    </View>
  );
}
