import { useClienteStore } from "@/src/store/cliente.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function ListaVacia() {
  const { buscador } = useClienteStore();
  return (
    <View className="mt-12 items-center justify-center">
      <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
        <Ionicons name="people-outline" size={40} color="#94a3b8" />
      </View>
      <Text className="text-lg font-semibold text-slate-900 dark:text-white">
        {buscador ? "Sin resultados" : "No hay clientes"}
      </Text>
      <Text className="mt-1 text-slate-500 dark:text-slate-400">
        {buscador
          ? "Prueba con otros términos de búsqueda"
          : "Los clientes aparecerán aquí una vez importados"}
      </Text>
    </View>
  );
}
