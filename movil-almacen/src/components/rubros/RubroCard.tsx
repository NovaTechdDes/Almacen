import { Rubro } from '@/src/interface';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  rubro: Rubro;
  index: number;
}

const CARD_COLORS = [
  {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-900/50',
    dot: 'bg-rose-500',
    title: 'text-rose-900 dark:text-rose-100',
    underline: 'bg-rose-500/30',
    refBg: 'bg-rose-200 dark:bg-rose-900/50',
    refText: 'text-rose-600 dark:text-rose-400',
  },
  {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/50',
    dot: 'bg-blue-500',
    title: 'text-blue-900 dark:text-blue-100',
    underline: 'bg-blue-500/30',
    refBg: 'bg-blue-200 dark:bg-blue-900/50',
    refText: 'text-blue-600 dark:text-blue-400',
  },
  {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    dot: 'bg-emerald-500',
    title: 'text-emerald-900 dark:text-emerald-100',
    underline: 'bg-emerald-500/30',
    refBg: 'bg-emerald-200 dark:bg-emerald-900/50',
    refText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-900/50',
    dot: 'bg-amber-500',
    title: 'text-amber-900 dark:text-amber-100',
    underline: 'bg-amber-500/30',
    refBg: 'bg-amber-200 dark:bg-amber-900/50',
    refText: 'text-amber-600 dark:text-amber-400',
  },
  {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900/50',
    dot: 'bg-purple-500',
    title: 'text-purple-900 dark:text-purple-100',
    underline: 'bg-purple-500/30',
    refBg: 'bg-purple-200 dark:bg-purple-900/50',
    refText: 'text-purple-600 dark:text-purple-400',
  },
  {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-200 dark:border-cyan-900/50',
    dot: 'bg-cyan-500',
    title: 'text-cyan-900 dark:text-cyan-100',
    underline: 'bg-cyan-500/30',
    refBg: 'bg-cyan-200 dark:bg-cyan-900/50',
    refText: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
    border: 'border-fuchsia-200 dark:border-fuchsia-900/50',
    dot: 'bg-fuchsia-500',
    title: 'text-fuchsia-900 dark:text-fuchsia-100',
    underline: 'bg-fuchsia-500/30',
    refBg: 'bg-fuchsia-200 dark:bg-fuchsia-900/50',
    refText: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  {
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-900/50',
    dot: 'bg-indigo-500',
    title: 'text-indigo-900 dark:text-indigo-100',
    underline: 'bg-indigo-500/30',
    refBg: 'bg-indigo-200 dark:bg-indigo-900/50',
    refText: 'text-indigo-600 dark:text-indigo-400',
  },
];

export const RubroCard = ({ rubro, index }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/productos/[rubroId]',
      params: { rubroId: rubro.id_rubro, nombre: rubro.nom_rubro },
    });
  };

  const color = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <Animated.View entering={FadeInDown.delay(rubro.id_rubro * 50).duration(500)} className="flex-1 m-1.5">
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View className={`w-full h-32 rounded-xl p-4 flex flex-col justify-between border shadow-sm ${color.bg} ${color.border}`}>
          {/* Index Number / ID */}
          <View className="flex-row justify-between items-start">
            <View className={`px-2 py-0.5 rounded-md ${color.refBg}`}>
              <Text className={`text-[10px] font-mono font-bold uppercase tracking-widest ${color.refText}`}>REF-{rubro.id_rubro.toString().padStart(3, '0')}</Text>
            </View>
            <View className={`h-10 w-5 mt-2 rounded-full `}>
              <Text className={`text-sm font-bold uppercase tracking-widest ${color.refText}`}>{rubro.cantidad_productos}</Text>
            </View>
          </View>

          {/* Title */}
          <View>
            <Text className={`font-black text-lg uppercase leading-none ${color.title}`} numberOfLines={2}>
              {rubro.nom_rubro}
            </Text>
            <View className={`h-1 w-6 mt-2 rounded-full ${color.underline}`} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
