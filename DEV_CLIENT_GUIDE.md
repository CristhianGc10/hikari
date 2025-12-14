# Guía de Expo Dev Client para Hikari

## ✅ Migración Completada

El proyecto ha sido migrado exitosamente de **Expo Go** a **Expo Dev Client** para obtener:

- ✨ Mejor rendimiento y velocidad
- 🔧 Mayor control sobre configuraciones nativas
- 📦 Soporte completo para librerías nativas personalizadas
- 🚀 Experiencia de desarrollo más cercana a producción
- 🎨 Todas las animaciones y funcionalidades optimizadas

---

## 🚀 Primeros Pasos

### 1. Generar Proyectos Nativos

Si aún no has generado los proyectos nativos (carpetas `android/` e `ios/`):

```bash
# Android
npm run prebuild

# O limpiar y regenerar
npm run prebuild:clean
```

### 2. Instalar el Development Build

#### Opción A: Desarrollo Local (Recomendado)

```bash
# Para Android
npm run android

# Para iOS (solo macOS)
npm run ios
```

Esto:
1. Compila el dev client con todas las dependencias nativas
2. Instala la app en tu dispositivo/emulador
3. Inicia el servidor de desarrollo

#### Opción B: Build con EAS (Alternativo)

```bash
# Instalar EAS CLI si no lo tienes
npm install -g eas-cli

# Login en Expo
eas login

# Build para desarrollo
eas build --profile development --platform android
```

Luego descarga e instala el APK generado.

### 3. Iniciar el Servidor de Desarrollo

```bash
npm start
```

Esto abre el dev client en tu dispositivo y conecta al bundler.

---

## 📱 Uso Diario

### Desarrollo Normal

1. **Primera vez**: Ejecuta `npm run android` para instalar el dev client
2. **Días siguientes**: Solo ejecuta `npm start`
3. La app se abrirá automáticamente y cargará los cambios en tiempo real

### Recarga Rápida

- **Shake** el dispositivo → Developer Menu
- **Double tap R** → Reload
- **Cmd/Ctrl + R** desde la terminal

### Debugging

- **Chrome DevTools**: Presiona `j` en la terminal
- **React DevTools**: Automático con dev client
- **Network Inspector**: Incluido en el dev menu

---

## 🔄 Cuándo Rebuild

Necesitas hacer rebuild (`npm run android`) cuando:

- ✅ Agregas una nueva dependencia nativa
- ✅ Modificas `app.json` o `app.config.js`
- ✅ Cambias plugins de Expo
- ✅ Actualizas versiones de dependencias nativas

**NO** necesitas rebuild para:
- ❌ Cambios en código JavaScript/TypeScript
- ❌ Cambios en estilos
- ❌ Modificaciones de componentes
- ❌ Actualizaciones de assets

---

## 📦 Scripts Disponibles

```json
{
  "start": "expo start --dev-client",      // Inicia dev server
  "android": "expo run:android",           // Build + run Android
  "ios": "expo run:ios",                   // Build + run iOS
  "prebuild": "expo prebuild",             // Genera proyectos nativos
  "prebuild:clean": "expo prebuild --clean" // Regenera desde cero
}
```

---

## 🎯 Ventajas del Dev Client

### vs Expo Go:

| Característica | Expo Go | Dev Client |
|----------------|---------|------------|
| Velocidad | ⚡ Rápido | 🚀 Muy Rápido |
| Librerías nativas | ⚠️ Solo las incluidas | ✅ Todas |
| Configuración nativa | ❌ Limitada | ✅ Completa |
| Hot Reload | ✅ Sí | ✅ Sí + Mejorado |
| Debugging | ✅ Básico | ✅ Avanzado |
| Tamaño app | 📦 Pequeña | 📦 Optimizada |

### Mejoras Específicas para Hikari:

- ✨ **Animaciones más fluidas** con Reanimated
- 🎵 **Audio optimizado** para pronunciación de kana
- ✍️ **Renderizado SVG mejorado** para trazos de kanji
- 📊 **Mejor gestión de memoria** para imágenes de vocabulario
- 🔄 **Transiciones más suaves** entre pantallas

---

## 🛠️ Troubleshooting

### Error: "No development build found"

**Solución**: Ejecuta `npm run android` para instalar el dev client.

### Error de compilación nativa

**Solución**:
```bash
# Limpiar cache
cd android && ./gradlew clean && cd ..

# Regenerar proyecto
npm run prebuild:clean
npm run android
```

### App no se conecta al bundler

**Solución**:
1. Verifica que estés en la misma red WiFi
2. Usa `expo start --tunnel` si tienes problemas de red
3. Revisa el firewall de Windows

### Cambios no se reflejan

**Solución**:
1. Shake → Reload
2. Cierra y vuelve a abrir la app
3. Si persiste: `npm start` y presiona `r` para reload

---

## 📚 Recursos

- [Expo Dev Client Docs](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Debugging Guide](https://docs.expo.dev/debugging/runtime-issues/)

---

## ✨ Configuración Actual

- **Expo SDK**: 54
- **React Native**: 0.81.5
- **Reanimated**: 4.1.1
- **Expo Router**: 6.0.19
- **Dev Client**: 6.0.20

---

**¡Disfruta del desarrollo mejorado con Expo Dev Client! 🎉**
