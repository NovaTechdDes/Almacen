import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface Props {
  visible: boolean;
  mensaje: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ToastConfirmacion({
  visible,
  mensaje,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: Props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          {/* Icon Header */}
          <View className="items-center pt-8 pb-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                <Ionicons name="help-circle" size={32} color="#d97706" />
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="px-8 pb-8 pt-2">
            <Text className="text-center text-lg font-bold text-slate-900 dark:text-white mb-2">
              ¿Estás seguro?
            </Text>
            <Text className="text-center text-base leading-6 text-slate-500 dark:text-slate-400">
              {mensaje}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row border-t border-slate-100 dark:border-slate-800">
            <Pressable
              onPress={onCancel}
              className="flex-1 items-center justify-center py-5 active:bg-slate-50 dark:active:bg-slate-800"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-base font-semibold text-slate-500 dark:text-slate-400">
                {cancelText}
              </Text>
            </Pressable>
            <View className="w-[1px] bg-slate-100 dark:bg-slate-800" />
            <Pressable
              onPress={onConfirm}
              className="flex-1 items-center justify-center py-5 active:bg-slate-50 dark:active:bg-slate-800"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-base font-bold text-amber-600 dark:text-amber-500">
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

