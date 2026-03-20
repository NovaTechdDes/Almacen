import { useClienteStore } from "@/src/store/cliente.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

export default function BuscadorCliente() {
  const { buscador, setBuscador } = useClienteStore();
  return (
    <View className="mb-6 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-900 shadow-black/5">
      <Ionicons name="search-outline" size={20} color="#94a3b8" />
      <TextInput
        placeholder="Buscar por nombre, DNI o localidad..."
        placeholderTextColor="#94a3b8"
        className="ml-3 flex-1 text-base text-slate-900 dark:text-white"
        value={buscador}
        onChangeText={setBuscador}
      />
      {buscador.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color="#94a3b8"
          onPress={() => setBuscador("")}
        />
      )}
    </View>
  );
}
