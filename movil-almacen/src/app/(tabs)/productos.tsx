import HeaderProductos from '@/src/components/productos/HeaderProductos';
import { ListaEmpty } from '@/src/components/productos/ListaEmpty';
import ProductoItem from '@/src/components/productos/ProductoItem';
import { useRubros } from '@/src/hooks/rubros/useRubros';
import { Producto, Rubro } from '@/src/interface';
import { useProductoStore } from '@/src/store/producto.store';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductos } from '../../hooks/productos/useProductos';

export default function ProductosScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;
  const { buscador, rubroSeleccionadoId } = useProductoStore();
  const { data, isLoading, error, refetch, isFetching } = useProductos(buscador, limit, offset, rubroSeleccionadoId ?? 0);
  const { data: rubros, isLoading: isLoadingRubros, refetch: refetchRubros } = useRubros();

  const onRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    await refetch();
    await refetchRubros();
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
  }, [buscador, rubroSeleccionadoId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950 p-5">
      {error && <Text>Error al cargar productos</Text>}

      <FlatList
        data={productos}
        keyExtractor={(item) => item.codigo}
        numColumns={3}
        ListHeaderComponent={<HeaderProductos isLoading={isLoadingRubros} rubros={(rubros as Rubro[]) || []} data={data || []} />}
        contentContainerStyle={{ flexGrow: 1, gap: 16, paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        ListEmptyComponent={<ListaEmpty data={productos} isLoading={isLoading} isFetching={isFetching} buscador={buscador} />}
        renderItem={({ item }) => <ProductoItem producto={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}
