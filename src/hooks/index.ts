/**
 * Custom hooks for partner data, signals, online status, stats, and settings.
 */

export { useAuth } from "@/context/AuthContext";
export { useTheme } from "@/context/ThemeContext";

// Re-export individual hooks for clean imports
export { usePartner } from "./usePartner";
export { useSignals } from "./useSignals";
export { useOnlineStatus } from "./useOnlineStatus";
export { useStats } from "./useStats";
export { useSettings } from "./useSettings";
