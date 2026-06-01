/**
 * Includes both Light and Dark mode variations.
 */

export const Colors = {
  light: {
    primary: "#090935", // Brand green
    secondary: "#147537", // Vibrant green
    background: "#F8FAFC",
    card: "#FFFFFF",
    accent: "#3B82F6",
    text: "#0F172A",
    muted: "#64748B",
    surface: "#ffffff", // Cards/Modals
    onPrimary: "#ffffff",
    textMuted: "#171515", // Neutral muted text
    border: "#64748B", // Light green border
    inputBorder: "#bbf7d0", // Input borders
    success: "#16a34a",
    error: "#dc2626",
    icon: "#15803d",
    tabActive: "#15803d",
    tabInactive: "#9ca3af",
    gradient: ["#111882", "#111882"] as const,
  },

  dark: {
    primary: "#111882", // Bright green for contrast
    secondary: "#1e723d",
    background: "#0F172A",
    card: "#1E293B",
    accent: "#3B82F6",
    text: "#F8FAFC",
    muted: "#94A3B8",
    surface: "#8f9a94", // Elevated surface
    onPrimary: "#ffffff",
    textMuted: "#dddddd",
    border: "#166534",
    inputBorder: "#15803d",
    success: "#4ade80",
    error: "#f87171",
    icon: "#86efac",
    tabActive: "#f0fdf4",
    tabInactive: "#6ee7b7",
    gradient: ["#111882", "#111882"] as const,
  },
};

export type ThemeType = "light" | "dark";
