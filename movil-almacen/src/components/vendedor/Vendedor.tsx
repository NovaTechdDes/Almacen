import { mensaje } from '@/src/utils/mensaje';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../../hooks';

const Vendedor = () => {
  const [codigo, setCodigo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { colors } = useAppTheme();

  const handleUser = async () => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify({ codigo, password }));
      mensaje('success', 'Usuario guardado correctamente');
    } catch (error) {
      console.warn('Error al guardar usuario', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@user');
        if (saved) {
          const user = JSON.parse(saved);
          setCodigo(user.codigo);
          setPassword(user.password);
        }
      } catch (error) {
        console.warn('Error al leer usuario', error);
      }
    })();
  }, []);

  return (
    <View className="mx-6 my-3 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800">
      <View className="flex-row items-center mb-6">
        <View className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl items-center justify-center mr-4">
          <Ionicons name="person" size={24} color="#6366f1" />
        </View>
        <View>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">Configuración de Vendedor</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm">Configuración de la contraseña y codigo del vendedor</Text>
        </View>
      </View>

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-2">Codigo del vendedor</Text>
          <TextInput
            placeholder="Codigo del vendedor"
            placeholderTextColor={colors.placeholder}
            value={codigo}
            onChangeText={setCodigo}
            className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
          />
        </View>
        <View className="mt-5">
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-2">Contraseña del vendedor</Text>
          <TextInput
            placeholder="Contraseña del vendedor"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
          />
        </View>
      </View>

      <View>
        <Pressable onPress={handleUser} className="bg-slate-900 dark:bg-white active:bg-slate-800 dark:active:bg-slate-200 rounded-xl px-4 py-3 items-center justify-center">
          <Text className="text-white dark:text-slate-900 font-bold text-base">Guardar Cambios</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Vendedor;
