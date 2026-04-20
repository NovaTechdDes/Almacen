import { Producto } from '@/src/interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
  producto: Producto;
}

export default function ProductoItem({ producto }: Props) {
  return (
    <View className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-gray-500 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Parte Superior: Imagen y Badges */}
      <View className="h-44 w-full bg-slate-100 dark:bg-slate-800 items-center justify-center relative">
        {producto.imagen_local ? (
          <Image className="h-full w-full" resizeMode="contain" source={{ uri: producto.imagen_local }} />
        ) : (
          <View className="items-center justify-center opacity-20">
            <Ionicons name="image-outline" size={64} color="#94a3b8" />
            <Text className="text-slate-400 text-xs font-bold mt-2">SIN IMAGEN</Text>
          </View>
        )}

        {/* Badge de Stock */}
        <View className="absolute top-3 left-3 bg-blue-600 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">Stock: {producto.stock}</Text>
        </View>
      </View>

      {/* Parte Inferior: Información */}
      <View className="p-4 gap-2">
        {/* Código y Meta */}
        <View className="flex-row items-center gap-2 justify-between">
          <View className="flex-row gap-2">
            <Ionicons name="barcode-outline" size={14} color="#94a3b8" />
            <Text className="text-xs text-slate-900 dark:text-white font-medium uppercase tracking-wider" numberOfLines={1}>
              {producto.codigo}
            </Text>
          </View>
          <View className="bg-blue-500 p-2 rounded-full text-white text-xl">
            <Text className=" text-white font-medium uppercase tracking-wider" numberOfLines={1}>
              {producto.rubro?.nom_rubro}
            </Text>
          </View>
        </View>

        {/* Descripción */}
        <Text className="text-lg font-bold text-slate-900 dark:text-white leading-tight h-12" numberOfLines={2}>
          {producto.descripcion}
        </Text>

        {/* Precios */}
        <View className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800 gap-1">
          {/* Unitario */}
          <View className="flex-row justify-between items-center">
            <Text className="text-slate-500 text-sm">Unitario</Text>
            <Text className="text-blue-600 font-bold text-md">$ {producto.precio?.toFixed(2) || 0}</Text>
          </View>

          {/* Mayoristas */}
          {producto.precios_mayoristas?.map((precio, index) => (
            <View className="flex-row justify-between items-center" key={precio.id_precio_mayorista}>
              <Text className="text-slate-400 text-lg">Mayorista {index + 1}</Text>
              <Text className="text-slate-400 text-lg">Cant: {precio.cant_mayorista}</Text>
              <Text className="text-emerald-600 font-semibold text-2xl">$ {precio.precio_mayorista?.toFixed(2) || '0.00'}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
