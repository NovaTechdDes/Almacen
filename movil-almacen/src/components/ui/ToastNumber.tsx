import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cantidad: string;
  setCantidad: (cantidad: string) => void;
  precio?: string;
  setPrecio?: (precioAux: string) => void;
  precioSugerido?: number;
}

export default function ToastNumber({ visible, onConfirm, onCancel, cantidad, setCantidad, precio, setPrecio, precioSugerido }: Props) {
  const handleCantidadChange = (text: string) => {
    setCantidad(text);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 bg-black/50">
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            {/* Icon Header */}
            <View className="items-center pt-6 pb-2">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                  <Ionicons name="help-circle" size={28} color="#d97706" />
                </View>
              </View>
            </View>

            {/* Content Cantidad */}
            <View className="px-6 pb-4 pt-2">
              <Text className="text-center text-base font-bold text-slate-900 dark:text-white mb-2">
                ¿Cuántas unidades deseas agregar?
              </Text>
              <TextInput
                value={cantidad}
                onChangeText={handleCantidadChange}
                keyboardType="numeric"
                selectTextOnFocus
                className="border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center text-lg font-bold text-black dark:text-white bg-slate-50 dark:bg-slate-800"
              />
            </View>

            {/* Precio (opcional) */}
            {precio !== undefined && setPrecio !== undefined && setPrecio && (
              <View className="px-6 pb-4 pt-1">
                <Text className="text-center text-base font-bold text-slate-900 dark:text-white mb-1">
                  Precio Unitario:
                </Text>
                {precioSugerido !== undefined && (
                  <Text className="text-center text-xs text-slate-400 mb-2">
                    Sugerido: ${precioSugerido.toFixed(2)}
                  </Text>
                )}
                <TextInput
                  selectTextOnFocus
                  onChangeText={setPrecio}
                  value={precio}
                  keyboardType="numeric"
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center text-lg font-bold text-black dark:text-white bg-slate-50 dark:bg-slate-800"
                />
              </View>
            )}

            {/* Actions */}
            <View className="flex-row border-t border-slate-100 dark:border-slate-800 mt-2">
              <Pressable
                onPress={onCancel}
                className="flex-1 items-center justify-center py-4 active:bg-slate-50 dark:active:bg-slate-800"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="text-base font-semibold text-slate-500 dark:text-slate-400">Cancelar</Text>
              </Pressable>
              <View className="w-[1px] bg-slate-100 dark:bg-slate-800" />
              <Pressable
                onPress={onConfirm}
                className="flex-1 items-center justify-center py-4 active:bg-slate-50 dark:active:bg-slate-800"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className="text-base font-bold text-amber-600 dark:text-amber-500">Agregar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}
