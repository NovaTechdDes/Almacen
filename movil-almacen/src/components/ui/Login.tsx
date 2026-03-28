import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function Login({ visible, onClose, onConfirm }: Props) {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm(password);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            className="absolute inset-0 bg-black/20"
          />

          <Animated.View
            entering={ZoomIn.delay(100).springify()}
            className="w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
          >
            {/* Header with Icon */}
            <View className="items-center mb-6">
              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 rotate-12">
                <View className="h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 -rotate-12">
                  <Ionicons name="lock-closed" size={32} color="#4f46e5" />
                </View>
              </View>
            </View>

            {/* Title & Description */}
            <View className="items-center mb-8">
              <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Acceso Requerido
              </Text>
              <Text className="text-center text-slate-500 dark:text-slate-400 text-base">
                Por favor, ingrese su contraseña para continuar
              </Text>
            </View>

            {/* Password Input */}
            <View className="mb-8">
              <View className="flex-row items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 h-16">
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#64748b"
                  className="mr-3"
                />
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 text-lg text-slate-900 dark:text-white"
                  autoFocus
                />
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row gap-4">
              <Pressable
                onPress={onClose}
                className="flex-1 h-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
              >
                <Text className="text-base font-semibold text-slate-600 dark:text-slate-300">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                className="flex-2 h-14 items-center justify-center rounded-2xl bg-indigo-600 active:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                <Text className="text-base font-bold text-white px-8">
                  Ingresar
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
