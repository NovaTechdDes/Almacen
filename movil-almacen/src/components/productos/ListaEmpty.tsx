import { Producto } from '@/src/interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Loading from '../ui/Loading';
interface Props {
  isLoading: boolean;
  isFetching: boolean;
  buscador: string;
  data: Producto[];
}

export const ListaEmpty = ({ isLoading, isFetching, buscador, data }: Props) => {
  if (isLoading || isFetching) {
    return (
      <View className="flex-1 items-center justify-center min-h-[200px]">
        <Loading texto="Buscando productos..." />
      </View>
    );
  }

  if (!isFetching && data && data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Ionicons name="search-outline" size={64} color="#94a3b8" />
        <Text className="text-lg font-bold text-slate-600 dark:text-slate-300 mt-4">Sin resultados</Text>
        <Text className="text-center text-slate-500 dark:text-slate-400 px-10">No encontramos productos que coincidan con {buscador} en este rubro.</Text>
      </View>
    );
  }

  return null;
};
