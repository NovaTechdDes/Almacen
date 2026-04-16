import { useProductos } from "@/src/hooks/productos/useProductos";
import { useProductoStore } from "@/src/store/producto.store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, TextInput, View } from "react-native";
import Loading from "../ui/Loading";
import PedidoItem from "./PedidoItem";

export default function ProductosPedidos() {
  const { buscador, setBuscador } = useProductoStore();
  const { data, isLoading } = useProductos(buscador);

  return (
    <View className="flex-1">
      {/* Buscador */}
      <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-6 shadow-sm shadow-slate-200 dark:shadow-none">
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          value={buscador}
          onChangeText={setBuscador}
          placeholder="Buscar productos..."
          placeholderTextColor="#94a3b8"
          className="flex-1 ml-3 text-slate-600 dark:text-white"
        />
      </View>

      {/* Grid de Productos o Loading */}
      {isLoading ? (
        <Loading texto="Cargando productos..." />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <PedidoItem producto={item} />}
          keyExtractor={(item) => item.id_producto.toString()}
          numColumns={2}
          columnWrapperStyle={{ gap: 16 }}
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
