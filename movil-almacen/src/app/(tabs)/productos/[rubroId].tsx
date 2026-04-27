import HeaderProductos from '@/src/components/productos/HeaderProductos';
import { ListaEmpty } from '@/src/components/productos/ListaEmpty';
import ProductoItem from '@/src/components/productos/ProductoItem';
import { useProductoForRubro } from '@/src/hooks/productos/useProductos';
import { useProductoStore } from '@/src/store/producto.store';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductosPorRubro() {
  const { rubroId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const { buscador } = useProductoStore();
  const { data: productos, isLoading, error, isFetching, refetch } = useProductoForRubro(Number(rubroId), buscador);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-slate-50 dark:bg-slate-900">
        <Text className="text-red-500 text-lg font-semibold text-center">Error al cargar productos</Text>
        <Text className="text-slate-500 text-center mt-2">Por favor, intenta de nuevo más tarde.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950 p-5">
      {error && <Text>Error al cargar productos</Text>}

      <FlatList
        data={productos}
        keyExtractor={(item) => item.codigo}
        numColumns={3}
        ListHeaderComponent={<HeaderProductos data={productos || []} />}
        contentContainerStyle={{ flexGrow: 1, gap: 16, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        ListEmptyComponent={<ListaEmpty buscador={buscador} data={productos || []} isLoading={isLoading} isFetching={isFetching} />}
        renderItem={({ item }) => <ProductoItem producto={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}
