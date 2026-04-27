import { Rubro } from '@/src/interface';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  rubro: Rubro;
}

export const RubroCard = ({ rubro }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/productos/[rubroId]',
      params: { rubroId: rubro.id_rubro, nombre: rubro.nom_rubro },
    });
  };

  return (
    <Animated.View entering={FadeInDown.delay(rubro.id_rubro * 50).duration(500)} className="flex-1 m-1.5">
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View className="w-full h-32 rounded-xl p-4 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Index Number / ID */}
          <View className="flex-row justify-between items-start">
            <View className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest">REF-{rubro.id_rubro.toString().padStart(3, '0')}</Text>
            </View>
            <View className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          </View>

          {/* Title */}
          <View>
            <Text className="text-slate-900 dark:text-white font-black text-lg uppercase leading-none" numberOfLines={2}>
              {rubro.nom_rubro}
            </Text>
            <View className="h-1 w-6 bg-indigo-500/30 mt-2 rounded-full" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
