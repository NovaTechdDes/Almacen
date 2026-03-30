import { probarConexion } from "@/src/actions/sincronizar.actions";
import { mensaje } from "@/src/utils/mensaje";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const initialState = {
  url: "",
};

const STORAGE_KEY = "@server_url";

export default function Servidor() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConexion, setLoadingConexion] = useState<boolean>(false);
  const [conexion, setConexion] = useState<boolean>(false);

  const handleConexion = async () => {
    setLoadingConexion(true);
    const { ok } = await probarConexion();
    if (!ok) {
      mensaje("error", "Error al contectarse al servidor");
    } else {
      mensaje("success", "Conexion exitosa");
    }
    setConexion(ok);
    setLoadingConexion(false);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, data.url);
      mensaje("success", "URL guardada correctamente");
    } catch (error) {
      console.warn("Error al guardar URL", error);
    }
    setLoading(false);
  };

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: initialState,
  });

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setValue("url", saved);
      } catch (error) {
        console.warn("Error al leer URL guardada", error);
      }
    })();
  }, [setValue]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      className="mx-6 my-3 p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mr-3">
            <Ionicons name="server-outline" size={20} color="#64748b" />
          </View>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">
            Servidor API
          </Text>
        </View>

        {loadingConexion ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : conexion !== null ? (
          <View
            className={`px-3 py-1 rounded-full flex-row items-center gap-1 ${conexion ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-rose-50 dark:bg-rose-900/20"}`}
          >
            <Ionicons
              name={conexion ? "checkmark-circle" : "close-circle"}
              size={14}
              color={conexion ? "#10b981" : "#f43f5e"}
            />
            <Text
              className={`text-xs font-bold ${conexion ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
            >
              {conexion ? "ONLINE" : "OFFLINE"}
            </Text>
          </View>
        ) : null}
      </View>

      <Controller
        control={control}
        name="url"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 ml-1">
              Dirección del Endpoint
            </Text>
            <TextInput
              onChangeText={onChange}
              placeholder="http://192.168.1.100:3000"
              onBlur={onBlur}
              keyboardType="url"
              autoCorrect={false}
              autoCapitalize="none"
              value={value}
              placeholderTextColor="#94a3b8"
              className="bg-slate-50 dark:bg-slate-800 h-12 px-4 rounded-xl text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-slate-700 focus:border-blue-500"
            />
          </View>
        )}
      />

      <View className="flex-row gap-3">
        <Pressable
          onPress={handleConexion}
          className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 rounded-xl items-center justify-center border border-slate-200 dark:border-slate-700"
        >
          <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm">
            Diagnóstico
          </Text>
        </Pressable>

        <Pressable
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          className={`flex-[2] h-12 rounded-xl items-center justify-center ${loading ? "bg-slate-200 dark:bg-slate-700" : "bg-slate-900 dark:bg-white active:opacity-90"}`}
        >
          {loading ? (
            <ActivityIndicator
              color={Platform.OS === "ios" ? "#000" : "#fff"}
              size="small"
            />
          ) : (
            <Text className="text-white dark:text-slate-900 font-bold text-base">
              Guardar Cambios
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
