/**
 * Semantic color palette for Rahau Sub.
 * Includes both Light and Dark mode variations.
 */

export const Colors = {
  light: {
    primary: "#15803d", // Brand green
    secondary: "#16a34a", // Vibrant green
    accent: "#3a4c40", // Accent green
    background: "#f6fff8", // Soft green-tinted white
    surface: "#ffffff", // Cards/Modals
    text: "#14532d", // Deep green text
    textMuted: "#6b7280", // Neutral muted text
    border: "#d1fae5", // Light green border
    inputBorder: "#bbf7d0", // Input borders
    success: "#16a34a",
    error: "#dc2626",
    icon: "#15803d",
    tabActive: "#15803d",
    tabInactive: "#9ca3af",
    gradient: ["#22c55e", "#22c55e"] as const,
  },

  dark: {
    primary: "#22c55e", // Bright green for contrast
    secondary: "#1e723d",
    accent: "#86efac",
    background: "#052e16", // Dark green background
    surface: "#454c48", // Elevated surface
    text: "#f0fdf4", // Soft white
    textMuted: "#bbf7d0",
    border: "#166534",
    inputBorder: "#15803d",
    success: "#4ade80",
    error: "#f87171",
    icon: "#86efac",
    tabActive: "#f0fdf4",
    tabInactive: "#6ee7b7",
    gradient: ["#22c55e", "#22c55e"] as const,
  },
};

export type ThemeType = "light" | "dark";
