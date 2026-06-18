export type ThemeName =
  | "coral"
  | "ocean"
  | "forest"
  | "lavender"
  | "amber"
  | "midnight";

export const THEME_OPTIONS: {
  id: ThemeName;
  label: string;
  colors: [string, string, string];
}[] = [
  {
    id: "coral",
    label: "Coral",
    colors: ["#FF6B6B", "#FF8E53", "#FF4757"],
  },
  {
    id: "ocean",
    label: "Ocean",
    colors: ["#4ECDC4", "#45B7D1", "#6C5CE7"],
  },
  {
    id: "forest",
    label: "Forest",
    colors: ["#2ECC71", "#27AE60", "#1ABC9C"],
  },
  {
    id: "lavender",
    label: "Lavender",
    colors: ["#A29BFE", "#6C5CE7", "#E8A0BF"],
  },
  {
    id: "amber",
    label: "Amber",
    colors: ["#FDCB6E", "#F39C12", "#E17055"],
  },
  {
    id: "midnight",
    label: "Midnight",
    colors: ["#6366F1", "#8B5CF6", "#3B82F6"],
  },
];
