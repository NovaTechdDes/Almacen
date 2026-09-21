import { RubroCard } from '@/src/components/rubros/RubroCard';
import Loading from '@/src/components/ui/Loading';
import { useRubros } from '@/src/hooks/rubros/useRubros';
import { Rubro } from '@/src/interface';
import { exportarCatalogoPdf } from '@/src/utils/generarHtmlCatalogo';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RubrosScreen() {
  const { data: rubros, isLoading, error } = useRubros();
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const filteredRubros = rubros?.filter((r) => r.nom_rubro.toLowerCase().includes(search.toLowerCase()));

  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    await exportarCatalogoPdf();
    setIsExporting(false);
  };

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
        ListHeaderComponent={<HeaderList isExporting={isExporting} onExportPdf={handleExportPdf} search={search} setSearch={setSearch} />}
        renderItem={({ item, index }: { item: Rubro; index: number }) => <RubroCard rubro={item} index={index} />}
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
  isExporting: boolean;
  onExportPdf: () => void;
}

const HeaderList = ({ search, setSearch, isExporting, onExportPdf }: HeaderProps) => {
  return (
    <View className="mt-6 mb-4">
      <View className="mb-6">
        <Text className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Categorías</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">Organiza y encuentra productos rápidamente</Text>
      </View>

      <TouchableOpacity onPress={onExportPdf} disabled={isExporting} activeOpacity={0.8} className="flex-row items-center gap-2 bg-blue-600 active:bg-blue-700 px-4 py-2.5 rounded-2xl shadow-sm">
        {isExporting ? <ActivityIndicator size="small" color="#ffffff" /> : <Ionicons name="document-text-outline" size={18} color="#ffffff" />}
        <Text className="text-white font-bold text-xs">{isExporting ? 'Generando...' : 'Exportar PDF'}</Text>
      </TouchableOpacity>

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
