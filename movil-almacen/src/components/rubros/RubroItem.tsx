import { Rubro } from '@/src/interface';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  rubro: Rubro;
}

export default function RubroItem({ rubro }: Props) {
  return (
    <View className="bg-gray-200 dark:bg-gray-800 p-2 rounded-lg">
      <Text className="text-gray-900 dark:text-white font-bold">{rubro.nom_rubro}</Text>
    </View>
  );
}
