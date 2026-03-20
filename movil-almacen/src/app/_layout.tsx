import { Stack } from "expo-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";
import { getDb } from "../db/db";
import { setupDatabase } from "../db/migration";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    setupDatabase();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        getDb();
      }
    });

    return () => {
      sub.remove();
    };
  });

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View className="flex-1 items-stretch bg-gray-50 dark:bg-slate-950">
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
                flex: 1,
                width: "100%",
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
