import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

const Actualizar = () => {
  const [checking, setChecking] = useState(false);
  const version = Constants.expoConfig?.version;

  const handleActualizar = async () => {
    try {
      setChecking(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert('Nueva Versión Detectada', 'Hay una actualización crítica disponible. ¿Deseas aplicarla ahora?', [
          {
            text: 'Más tarde',
            style: 'cancel',
          },
          {
            text: 'Actualizar Ahora',
            style: 'default',
            onPress: async () => {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            },
          },
        ]);
      } else {
        Alert.alert('Sistema Actualizado', 'Ya cuentas con la versión más reciente del sistema.');
      }
    } catch {
      Alert.alert('Error de Mantenimiento', 'No se pudo verificar el estado de las actualizaciones.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <View className="mx-6 my-3 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full items-center justify-center mr-3">
            <Ionicons name="construct-outline" size={20} color="#d97706" />
          </View>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">Sistema</Text>
        </View>

        <View className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <Text className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">v{version}</Text>
        </View>
      </View>

      <Pressable
        onPress={handleActualizar}
        disabled={checking}
        className={`h-12 rounded-xl flex-row items-center justify-center gap-2 ${checking ? 'bg-slate-100 dark:bg-slate-800' : 'bg-amber-500 active:bg-amber-600'}`}
      >
        {checking ? (
          <ActivityIndicator size="small" color="#d97706" />
        ) : (
          <>
            <Ionicons name="cloud-download-outline" color="white" size={20} />
            <Text className="font-bold text-white text-base">Buscar Actualizaciones</Text>
          </>
        )}
      </Pressable>

      <Text className="text-center mt-3 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-tighter">Verificación de integridad y parches de seguridad</Text>
    </View>
  );
};

export default Actualizar;
