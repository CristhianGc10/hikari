/// <reference types="nativewind/types" />

// Esto soluciona el error de tipos de las fuentes si el paquete no trae types
declare module '@expo-google-fonts/noto-sans-jp' {
  export const useFonts: (
    map: Record<string, string>
  ) => [boolean, Error | null];

  export const NotoSansJP_400Regular: any;
  export const NotoSansJP_700Bold: any;
}
