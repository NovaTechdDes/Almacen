import { Pedido } from '@/src/interface';
import React from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import HeaderPedidos from './HeaderPedidos';
import ListaVacia from './ListaVacia';
import PedidoCard from './PedidoCard';

interface Props {
  pedidos: Pedido[];
  refreshing: boolean;
  onRefresh: () => void;
}

export default function ListaPedidos({ pedidos, refreshing, onRefresh }: Props) {
  const { width } = useWindowDimensions();

  // 1 columna en teléfono vertical, 2 en horizontal/tablet, 3 en tablet grande
  const numColumns = width >= 1100 ? 3 : width >= 700 ? 2 : 1;
  const gap = width >= 700 ? 16 : 12;

  return (
    <View className="flex-1">
      <FlatList
        key={numColumns}
        data={pedidos}
        keyExtractor={(item) => item?.id_pedido?.toString() || ''}
        renderItem={({ item }) => (
          <View style={numColumns > 1 ? { flex: 1 / numColumns } : undefined}>
            <PedidoCard item={item} />
          </View>
        )}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap, alignItems: 'flex-start' } : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: width >= 700 ? 24 : 16, paddingBottom: 100, gap }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<ListaVacia />}
        ListHeaderComponent={<HeaderPedidos />}
      />
    </View>
  );
}
