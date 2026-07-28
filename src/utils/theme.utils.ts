const THEME_PRESETS: Record<string, { hex: string; rgb: string }> = {
  Azul: { hex: "#3B82F6", rgb: "59 130 246" },
  blue: { hex: "#3B82F6", rgb: "59 130 246" },
  Teal: { hex: "#0D9488", rgb: "13 148 136" },
  Verde: { hex: "#10B981", rgb: "16 185 129" },
  Ámbar: { hex: "#D97706", rgb: "217 119 6" },
  Violeta: { hex: "#8B5CF6", rgb: "139 92 246" },
  Coral: { hex: "#F43F5E", rgb: "244 63 94" },
  Gris: { hex: "#64748B", rgb: "100 116 139" },
};

export function applyThemeColor(name: string): void {
  const preset = THEME_PRESETS[name] ?? THEME_PRESETS["blue"];
  const root = document.documentElement;
  root.style.setProperty("--c-primary", preset.hex);
  root.style.setProperty("--c-primary-rgb", preset.rgb);
}
