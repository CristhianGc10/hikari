// app/modules/kana/practice/[char].tsx
import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Dimensions, ActivityIndicator, Animated, Pressable } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { KanaAnimation } from "@/src/components/kana/KanaAnimation";
import { KanaWriting } from "@/src/components/kana/KanaWriting";

// Servicio de carga de trazos
import { loadStrokesWithMetadata } from "@/src/services/strokeLoader";

// Registro de SVGs (importar todos los SVGs necesarios)
import SVG_REGISTRY from "@/src/data/svgRegistry";

const { width } = Dimensions.get("window");
const CARD_SIZE = width - 48;
const PADDING = 20;

// Colores del selector (consistentes con el tema)
const OBSERVE_COLOR = '#F5A238';  // Naranja del tema N5
const WRITE_COLOR = '#22c55e';     // Verde para escribir

export default function KanaPracticeScreen() {
  const { char } = useLocalSearchParams();
  const character = Array.isArray(char) ? char[0] : char || "あ";

  const [strokes, setStrokes] = useState<string[]>([]);
  const [strokeWidth, setStrokeWidth] = useState<number>(6);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'observe' | 'write'>('observe');

  // Animación del selector
  const slideAnim = useRef(new Animated.Value(0)).current;
  const selectorWidth = (width - PADDING * 2 - 8) / 2;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: mode === 'observe' ? 0 : selectorWidth,
      useNativeDriver: true,
      tension: 100,
      friction: 12,
    }).start();
  }, [mode]);

  useEffect(() => {
    loadData();
  }, [character]);

  const loadData = () => {
    setLoading(true);
    try {
      // Usar el servicio de carga de trazos con metadata
      const result = loadStrokesWithMetadata(character, SVG_REGISTRY);
      setStrokes(result.strokes);
      setStrokeWidth(result.strokeWidth);
    } finally {
      setLoading(false);
    }
  };

  // Color activo según el modo
  const activeColor = mode === 'observe' ? OBSERVE_COLOR : WRITE_COLOR;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Selector de modo - Mismo estilo que index.tsx */}
      <View style={{ paddingHorizontal: PADDING, paddingTop: 10, marginBottom: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            borderRadius: 10,
            padding: 4,
            position: 'relative',
          }}
        >
          {/* Selector animado (fondo blanco que se desliza) */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 4,
              bottom: 4,
              left: 4,
              width: '50%',
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              transform: [{ translateX: slideAnim }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          />

          {/* Botón Observar */}
          <Pressable
            onPress={() => setMode('observe')}
            style={{ flex: 1, zIndex: 1 }}
          >
            <View
              style={{
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: 'NotoSansJP_700Bold',
                  fontSize: 18,
                  color: mode === 'observe' ? OBSERVE_COLOR : '#9CA3AF',
                }}
              >
                観る
              </Text>
            </View>
          </Pressable>

          {/* Botón Escribir */}
          <Pressable
            onPress={() => setMode('write')}
            style={{ flex: 1, zIndex: 1 }}
          >
            <View
              style={{
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: 'NotoSansJP_700Bold',
                  fontSize: 18,
                  color: mode === 'write' ? WRITE_COLOR : '#9CA3AF',
                }}
              >
                書く
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={activeColor} />
          </View>
        ) : strokes.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}>
            <Text
              style={{
                fontFamily: 'NotoSansJP_400Regular',
                fontSize: 16,
                color: '#6B7280',
                textAlign: 'center',
              }}
            >
              No hay datos de trazos disponibles para este carácter.
            </Text>
          </View>
        ) : (
          <>
            {mode === 'observe' ? (
              <KanaAnimation strokes={strokes} size={CARD_SIZE} strokeWidth={strokeWidth} />
            ) : (
              <KanaWriting strokes={strokes} size={CARD_SIZE} strokeWidth={strokeWidth} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}