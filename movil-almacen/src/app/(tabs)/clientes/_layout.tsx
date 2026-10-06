import { useAppTheme } from '@/src/hooks';
import { Stack } from 'expo-router';
import React from 'react';

export default function ClientesLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontWeight: 'bold', color: colors.text },
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.card },
      }}
    >
      {/* El listado ya trae su propio encabezado */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="nuevo" options={{ title: 'Nuevo Cliente' }} />
    </Stack>
  );
}
