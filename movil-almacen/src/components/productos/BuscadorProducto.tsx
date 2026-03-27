import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";
import { useProductoStore } from "../../store/producto.store";

const BuscadorProducto = () => {
  const { buscador, setBuscador } = useProductoStore();

  return (
    <View className="flex-row items-center gap-2 rounded-2xl bg-white px-4 py-3 border border-gray-300 dark:border-gray-700">
      <Ionicons name="search" size={24} color="#94a3b8" />
      <TextInput
        placeholder="Buscar por descripcion, marca o codigo..."
        placeholderTextColor="#94a3b8"
        className="ml-3  text-base text-slate-900 dark:text-white"
        value={buscador}
        onChangeText={setBuscador}
      />
    </View>
  );
};

export default BuscadorProducto;
