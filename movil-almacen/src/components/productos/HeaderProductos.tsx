import { Producto, Rubro } from '@/src/interface';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import RubroItem from '../rubros/RubroItem';
import BuscadorProducto from './BuscadorProducto';

interface Props {
  data: Producto[];
  rubros: Rubro[];
}

export default function HeaderProductos({ data, rubros }: Props) {
  return (
    <View>
      <View className="mb-5 md:flex-row justify-between">
        <View>
          <Text className="text-2xl font-bold  text-gray-900 dark:text-white">Productos</Text>
          <Text className="text-md font-bold  text-gray-900 dark:text-white">{data?.length} productos en el catálogo</Text>
        </View>

        <View className=" items-center justify-between gap-2">
          <BuscadorProducto />
        </View>
      </View>

      <View>
        <FlatList
          data={rubros}
          keyExtractor={(item) => item.id_rubro.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
          renderItem={({ item }) => <RubroItem rubro={item} />}
        />
      </View>
    </View>
  );
}
