import BuscadorProducto from "@/src/components/productos/BuscadorProducto";
import ProductoItem from "@/src/components/productos/ProductoItem";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductos } from "../../hooks/productos/useProductos";

export default function ProductosScreen() {
  const { data, isLoading, error } = useProductos();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950 p-5">
      <View className="mb-5 flex-row justify-between">
        <View>
          <Text className="text-2xl font-bold  text-gray-900 dark:text-white">
            Productos
          </Text>
          <Text className="text-md font-bold  text-gray-900 dark:text-white">
            {data?.length} productos en el catálogo
          </Text>
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <BuscadorProducto />
        </View>
      </View>

      {isLoading && <Text>Cargando...</Text>}

      {error && <Text>Error al cargar productos</Text>}

      <FlatList
        data={data}
        keyExtractor={(item) => item.codigo}
        numColumns={3}
        className="bg-gray-100 dark:bg-slate-900"
        contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        renderItem={({ item }) => <ProductoItem producto={item} />}
      />
    </SafeAreaView>
  );
}
