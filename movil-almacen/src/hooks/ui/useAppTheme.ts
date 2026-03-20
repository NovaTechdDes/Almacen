import { useColorScheme } from "nativewind";

export const useAppTheme = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    isDark,
    colors: {
      background: isDark ? "#020617" : "#f8fafc", // slate-950 : slate-50
      card: isDark ? "#0f172a" : "#ffffff", // slate-900 : white
      border: isDark ? "#1e293b" : "#f1f5f9", // slate-800 : slate-100
      text: isDark ? "#f8fafc" : "#1e293b", // slate-50 : slate-800
      textMuted: isDark ? "#64748b" : "#94a3b8", // slate-500 : slate-400
      primary: "#2563eb", // blue-600
      accent: isDark ? "#60a5fa" : "#2563eb", // blue-400 : blue-600
      placeholder: isDark ? "#475569" : "#94a3b8", // slate-600 : slate-400
      icon: isDark ? "#94a3b8" : "#64748b", // slate-400 : slate-500
    },
  };
};
