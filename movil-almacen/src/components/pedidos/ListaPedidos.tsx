import { Pedido } from '@/src/interface';
import React from 'react';
import { FlatList, View } from 'react-native';
import HeaderPedidos from './HeaderPedidos';
import ListaVacia from './ListaVacia';
import PedidoCard from './PedidoCard';

interface Props {
  pedidos: Pedido[];
  refreshing: boolean;
  onRefresh: () => void;
}

export default function ListaPedidos({ pedidos, refreshing, onRefresh }: Props) {
  return (
    <View className="flex-1">
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item?.id_pedido?.toString() || ''}
        renderItem={({ item }) => <PedidoCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<ListaVacia />}
        ListHeaderComponent={<HeaderPedidos />}
      />
    </View>
  );
}
