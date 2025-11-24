import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Definimos el tema Hikari basado en Material 3
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B91C1C',       // Rojo japonés profundo
    onPrimary: '#FFFFFF',     // Texto sobre el rojo
    secondary: '#374151',     // Gris oscuro para acentos
    background: '#FAFAF9',    // Un blanco cálido (tipo papel de arroz)
    surface: '#FFFFFF',       // Superficie de tarjetas
    surfaceVariant: '#F5F5F4', // Variante para fondos suaves
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F5F5F4',
      level3: '#E7E5E4',
      level4: '#D6D3D1',
      level5: '#A8A29E',
    },
  },
  // Aquí podríamos personalizar tipografías específicas más adelante
};