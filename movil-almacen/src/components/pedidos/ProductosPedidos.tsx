import { useProductos } from "@/src/hooks/productos/useProductos";
import { Producto } from "@/src/interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface Props {
  producto: Producto;
}

export default function ProductosPedidos() {
  const { data, isLoading } = useProductos();

  return (
    <View>
      <View>
        <Ionicons name="search" size={24} color="black" />
        <TextInput placeholder="Buscar Productos..." />
      </View>
      <View>
        <FlatList
          data={data}
          renderItem={({ item }) => renderItem({ producto: item })}
          keyExtractor={(item) => item.id_producto.toString()}
        />
      </View>
    </View>
  );
}

const renderItem = ({ producto }: Props) => {
  return (
    <View className="flex-row items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
      <View className="h-12 w-12 bg-gray-100 dark:bg-slate-800 rounded-lg items-center justify-center">
        <Ionicons name="cube-outline" size={24} color="#64748b" />
      </View>

      <View className="flex-1">
        <Text className="text-slate-900 dark:text-white font-medium text-base">
          {producto.descripcion}
        </Text>
        <Text className="text-slate-500 text-xs">
          Stock: {producto.stock} • ${producto.precio.toFixed(2)}
        </Text>
      </View>

      <Pressable className="bg-blue-50 p-2 rounded-full dark:bg-blue-900/30">
        <Ionicons name="add" size={24} color="#2563eb" />
      </Pressable>
    </View>
  );
};
