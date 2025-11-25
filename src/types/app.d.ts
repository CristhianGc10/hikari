/// <reference types="nativewind/types" />

// 1. Declaración para que TypeScript entienda los archivos .svg
declare module "*.svg" {
  const content: any;
  export default content;
}

// 2. Solución para tipos de fuentes de Google Fonts
declare module '@expo-google-fonts/noto-sans-jp' {
  export const useFonts: (
    map: Record<string, string>
  ) => [boolean, Error | null];

  export const NotoSansJP_400Regular: any;
  export const NotoSansJP_700Bold: any;
}