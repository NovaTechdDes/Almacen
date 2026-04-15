import HeaderProductos from '@/src/components/productos/HeaderProductos';
import ProductoItem from '@/src/components/productos/ProductoItem';
import { useProductoStore } from '@/src/store/producto.store';
import React, { useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductos } from '../../hooks/productos/useProductos';

export default function ProductosScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { buscador } = useProductoStore();
  const { data, isLoading, error, refetch } = useProductos(buscador);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950 p-5">
      {isLoading && <Text>Cargando...</Text>}

      {error && <Text>Error al cargar productos</Text>}

      <FlatList
        data={data}
        keyExtractor={(item) => item.codigo}
        numColumns={3}
        className=""
        ListHeaderComponent={<HeaderProductos data={data || []} />}
        contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        renderItem={({ item }) => <ProductoItem producto={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}
