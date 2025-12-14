// src/core/theme.ts
// ============================================================================
// HIKARI THEME - Integración con React Native Paper
// ============================================================================

import { MD3LightTheme as DefaultTheme, MD3Theme } from "react-native-paper";
import { colors, radius, typography } from "../design/tokens";

export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    // Primarios - Usando Yamabuki (N5) como default
    primary: colors.levels.n5.main,
    onPrimary: colors.text.inverse,
    primaryContainer: colors.levels.n5.light,
    onPrimaryContainer: colors.levels.n5.dark,

    // Secundarios
    secondary: colors.text.secondary,
    onSecondary: colors.text.inverse,
    secondaryContainer: colors.border.light,
    onSecondaryContainer: colors.text.primary,

    // Terciarios
    tertiary: colors.levels.n3.main,
    onTertiary: colors.text.inverse,
    tertiaryContainer: colors.levels.n3.light,
    onTertiaryContainer: colors.levels.n3.dark,

    // Superficies
    background: colors.background,
    onBackground: colors.text.primary,
    surface: colors.surface,
    onSurface: colors.text.primary,
    surfaceVariant: colors.border.light,
    onSurfaceVariant: colors.text.secondary,
    surfaceDisabled: colors.border.light,
    onSurfaceDisabled: colors.text.disabled,

    // Estados
    error: colors.state.error.main,
    onError: colors.text.inverse,
    errorContainer: colors.state.error.light,
    onErrorContainer: colors.state.error.dark,

    // Bordes
    outline: colors.border.medium,
    outlineVariant: colors.border.light,

    // Elevación
    elevation: {
      level0: "transparent",
      level1: colors.surface,
      level2: colors.surfaceElevated,
      level3: colors.surfaceElevated,
      level4: colors.surfaceElevated,
      level5: colors.surfaceElevated,
    },

    // Otros
    shadow: colors.text.primary,
    scrim: colors.overlay,
    inverseSurface: colors.text.primary,
    inverseOnSurface: colors.text.inverse,
    inversePrimary: colors.levels.n5.light,
    backdrop: colors.overlay,
  },

  // Bordes redondeados base
  roundness: radius.lg,

  // Animaciones
  animation: {
    scale: 1.0,
  },
};

// ============================================================================
// VARIANTES DE TEMA POR NIVEL
// ============================================================================

/**
 * Crea una variante del tema para un nivel específico
 */
export const createLevelTheme = (
  level: "n5" | "n4" | "n3" | "n2" | "n1"
): MD3Theme => {
  const levelColors = colors.levels[level];

  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: levelColors.main,
      primaryContainer: levelColors.light,
      onPrimaryContainer: levelColors.dark,
    },
  };
};

// Temas predefinidos por nivel
export const themeN5 = createLevelTheme("n5");
export const themeN4 = createLevelTheme("n4");
export const themeN3 = createLevelTheme("n3");
export const themeN2 = createLevelTheme("n2");
export const themeN1 = createLevelTheme("n1");

export default theme;
