import { Producto } from '@/src/interface';
import React from 'react';
import { Text, View } from 'react-native';

import BuscadorProducto from './BuscadorProducto';

interface Props {
  data: Producto[];
}

export default function HeaderProductos({ data }: Props) {
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
    </View>
  );
}
