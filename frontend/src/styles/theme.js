const theme = {
  colors: {
    bg: "#0D0F1C",
    surface: "#161929",
    surfaceAlt: "#1E2235",
    border: "#2A2F4A",
    primary: "#7C3AED",
    primaryHover: "#6D28D9",
    primaryLight: "#7C3AED22",
    accent: "#F59E0B",
    accentHover: "#D97706",
    accentLight: "#F59E0B22",
    success: "#10B981",
    successLight: "#10B98122",
    error: "#EF4444",
    errorLight: "#EF444422",
    warning: "#F59E0B",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#475569",
  },
  fonts: {
    display: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSizes: {
    xs: "0.75rem", sm: "0.875rem", md: "1rem",
    lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem",
    "3xl": "1.875rem", "4xl": "2.25rem",
  },
  fontWeights: {
    normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800,
  },
  radii: {
    sm: "6px", md: "10px", lg: "16px", xl: "24px", full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.4)",
    md: "0 4px 16px rgba(0,0,0,0.4)",
    lg: "0 8px 32px rgba(0,0,0,0.5)",
    glow: "0 0 20px rgba(124, 58, 237, 0.35)",
    glowAccent: "0 0 20px rgba(245, 158, 11, 0.35)",
  },
  transitions: {
    fast: "0.15s ease", base: "0.25s ease", slow: "0.4s ease",
  },
  zIndex: {
    base: 1, dropdown: 100, modal: 200, toast: 300,
  },
};

export default theme;
