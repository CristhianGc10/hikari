import React, { useState, useEffect } from "react";
import { View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { Surface, Text, TouchableRipple } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { KanaAnimation } from "@/src/components/kana/KanaAnimation";
import { KanaWriting } from "@/src/components/kana/KanaWriting";

import KVG_INDEX from "../../../../assets/kvg-index.json";
import kana03042 from "../../../../assets/kanjivg/03042.svg";

const SVG_FILES: Record<string, string> = {
  "03042.svg": kana03042,
};

const { width } = Dimensions.get("window");
const CARD_SIZE = width - 48; 

export default function KanaPracticeScreen() {
  const { char } = useLocalSearchParams();
  const character = Array.isArray(char) ? char[0] : char || "あ";

  const [strokes, setStrokes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'observe' | 'write'>('observe');

  useEffect(() => {
    loadData();
  }, [character]);

  const loadData = () => {
    setLoading(true);
    try {
      const fileEntry = (KVG_INDEX as any)[character];
      if (!fileEntry || fileEntry.length === 0) {
        setStrokes([]);
        return;
      }
      
      const filename = fileEntry[0];
      const svgContent = SVG_FILES[filename];

      if (svgContent) {
        const paths = extractPathsFromSvg(svgContent);
        setStrokes(paths);
      }
    } finally {
      setLoading(false);
    }
  };

  const extractPathsFromSvg = (svg: string) => {
    const paths: string[] = [];
    const regex = /<path[^>]*\sd="([^"]+)"/g;
    let match;
    while ((match = regex.exec(svg)) !== null) {
      paths.push(match[1]);
    }
    return paths;
  };

  const padding = 20; // Mismo valor que index.tsx

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF9" }} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* SELECTOR DE MODO - Exactamente igual que index.tsx */}
      <View style={{ paddingHorizontal: padding, marginBottom: 16 }}>
        <Surface style={{ 
          flexDirection: 'row', 
          backgroundColor: '#e5e5e5', 
          borderRadius: 16, 
          padding: 4, 
          overflow: 'hidden'
        }} elevation={0} mode="flat">
          
          {/* Observar Toggle */}
          <TouchableRipple 
            onPress={() => setMode('observe')} 
            style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
          >
            <View style={{ 
              backgroundColor: mode === 'observe' ? 'white' : 'transparent',
              paddingVertical: 6,
              alignItems: 'center',
              borderRadius: 12,
              elevation: mode === 'observe' ? 1 : 0
            }}>
              <Text style={{ 
                fontFamily: 'NotoSansJP_700Bold', 
                color: mode === 'observe' ? '#B91C1C' : '#78716c',
                fontSize: 16
              }}>
                観察
              </Text>
            </View>
          </TouchableRipple>

          {/* Escribir Toggle */}
          <TouchableRipple 
            onPress={() => setMode('write')} 
            style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
          >
            <View style={{ 
              backgroundColor: mode === 'write' ? 'white' : 'transparent',
              paddingVertical: 6,
              alignItems: 'center',
              borderRadius: 12,
              elevation: mode === 'write' ? 1 : 0
            }}>
              <Text style={{ 
                fontFamily: 'NotoSansJP_700Bold', 
                color: mode === 'write' ? '#7C3AED' : '#78716c',
                fontSize: 16
              }}>
                書く
              </Text>
            </View>
          </TouchableRipple>

        </Surface>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: 40 }}>
        {/* Contenido Principal */}
        <View style={{ alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="large" color="#B91C1C" style={{ marginTop: 40 }} />
          ) : (
            <View>
              {mode === "observe" ? (
                <KanaAnimation strokes={strokes} size={CARD_SIZE} />
              ) : (
                <KanaWriting 
                  strokes={strokes} 
                  size={CARD_SIZE} 
                  onComplete={() => console.log("Escritura completa")} 
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}