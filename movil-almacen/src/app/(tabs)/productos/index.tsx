import { RubroCard } from '@/src/components/rubros/RubroCard';
import Loading from '@/src/components/ui/Loading';
import { useRubros } from '@/src/hooks/rubros/useRubros';
import { Rubro } from '@/src/interface';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, View } from 'react-native';

export default function RubrosScreen() {
  const { data: rubros, isLoading, error } = useRubros();
  const [search, setSearch] = useState('');

  const filteredRubros = rubros?.filter((r) =>
    r.nom_rubro.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <Loading texto="Cargando Rubros" />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-slate-50 dark:bg-slate-900">
        <Text className="text-red-500 text-lg font-semibold text-center">Error al cargar rubros</Text>
        <Text className="text-slate-500 text-center mt-2">Por favor, intenta de nuevo más tarde.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <FlatList
        data={filteredRubros}
        ListHeaderComponent={<HeaderList search={search} setSearch={setSearch} />}
        renderItem={({ item }: { item: Rubro }) => <RubroCard rubro={item} />}
        keyExtractor={(item: Rubro) => item.id_rubro.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        columnWrapperStyle={{ gap: 8 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

interface HeaderProps {
  search: string;
  setSearch: (text: string) => void;
}

const HeaderList = ({ search, setSearch }: HeaderProps) => {
  return (
    <View className="mt-6 mb-4">
      <View className="mb-6">
        <Text className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
          Categorías
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Organiza y encuentra productos rápidamente
        </Text>
      </View>

      <View className="relative">
        <View className="absolute left-3 top-3 z-10">
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
        </View>
        <TextInput
          className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-slate-900 dark:text-white"
          placeholder="Buscar rubro..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  );
};
