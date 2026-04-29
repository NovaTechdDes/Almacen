import { useAppTheme } from '@/src/hooks';
import { Stack } from 'expo-router';
import React from 'react';

export default function ProductosLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
        },
        headerTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.card,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Rubros' }} />
      <Stack.Screen name="[rubroId]" options={{ title: 'Productos' }} />
    </Stack>
  );
}
