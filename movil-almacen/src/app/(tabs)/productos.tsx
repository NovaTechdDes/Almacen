import HeaderProductos from '@/src/components/productos/HeaderProductos';
import ProductoItem from '@/src/components/productos/ProductoItem';
import { useRubros } from '@/src/hooks/rubros/useRubros';
import { Producto, Rubro } from '@/src/interface';
import { useProductoStore } from '@/src/store/producto.store';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductos } from '../../hooks/productos/useProductos';

export default function ProductosScreen() {
  const [offset, setOffset] = useState(0);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;
  const { buscador } = useProductoStore();
  const { data, isLoading, error, refetch } = useProductos(buscador, limit, offset);
  const { data: rubros, isLoading: isLoadingRubros, error: errorRubros, refetch: refetchRubros } = useRubros();

  const onRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    await refetch();
    setRefreshing(false);
  };

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
    setProductos([]);
  }, [buscador]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950 p-5">
      {isLoading && <Text>Cargando...</Text>}

      {error && <Text>Error al cargar productos</Text>}

      <FlatList
        data={productos}
        keyExtractor={(item) => item.codigo}
        numColumns={3}
        ListHeaderComponent={<HeaderProductos rubros={(rubros as Rubro[]) || []} data={data || []} />}
        contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        renderItem={({ item }) => <ProductoItem producto={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}
