// src/core/theme.ts
import { MD3LightTheme as DefaultTheme, MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B91C1C',
    onPrimary: '#FFFFFF',

    secondary: '#374151',
    onSecondary: '#FFFFFF',

    background: '#FFF1F2',
    surface: '#FFFFFF',
    surfaceVariant: '#FFE4E6',

    outline: '#E11D48',
  },
  roundness: 20,
  // Aquí más adelante puedes personalizar tipografías si quieres
};
