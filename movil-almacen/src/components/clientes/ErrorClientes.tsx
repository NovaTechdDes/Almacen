import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function ErrorClientes() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6 dark:bg-slate-950">
      <View className="items-center rounded-3xl bg-red-50 p-6 dark:bg-red-500/10">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="mt-4 text-center text-lg font-bold text-slate-900 dark:text-white">
          Error al cargar clientes
        </Text>
        <Text className="mt-2 text-center text-slate-500 dark:text-slate-400">
          Hubo un problema al conectar con la base de datos local.
        </Text>
      </View>
    </View>
  );
}
