import { useProductos } from "@/src/hooks/productos/useProductos";
import { Producto } from "@/src/interface";
import { useProductoStore } from "@/src/store/producto.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import Loading from "../ui/Loading";
import PedidoItem from "./PedidoItem";

export default function ProductosPedidos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { buscador, setBuscador } = useProductoStore();
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;
  const { data, isLoading } = useProductos(buscador, limit, offset, 0);
  const cargarMas = () => {
    if (isLoading || !hasMore) return;

    setOffset((prev) => prev + limit);
  };

    useEffect(() => {
      if (!data) return;
  
      if (offset === 0) {
        setProductos(data); // primera carga o búsqueda nueva
        setHasMore(data.length === limit);
      } else {
        setProductos((prev) => [...prev, ...data]); // paginación
        setHasMore(data.length === limit);
      }
    }, [data, offset]);

      useEffect(() => {
        setOffset(0);
        setHasMore(true);
      }, [buscador]);

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
      {isLoading && productos.length === 0 ? (
        <Loading texto="Cargando productos..." />
      ) : (
        <FlatList
          data={productos}
          renderItem={({ item }) => <PedidoItem producto={item} />}
          keyExtractor={(item) => item.id_producto.toString()}
          numColumns={2}
          columnWrapperStyle={{ gap: 16 }}
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onEndReached={cargarMas}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ isLoading && productos.length > 0 ? <Loading texto="Cargando más productos..." /> : null}
        />
      )}
    </View>
  );
}
