// app/modules/vocab/word/[id].tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
} from "react-native"; // <--- Agregado StyleSheet
import { Text, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BookOpen, Play, Pause } from "lucide-react-native";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  interpolate,
  SharedValue, // <--- Importado directamente
} from "react-native-reanimated";

import { getWordById, VOCAB_DATA } from "@/src/data/vocabData";

const { width } = Dimensions.get("window");

// =============================================================================
// CONSTANTES Y COLORES
// =============================================================================

const THEME_COLOR = "#F5A238";
const THEME_LIGHT = "#FEF7ED";
const PADDING = 20;
const IMAGE_SIZE = width - PADDING * 2 - 48;

const CATEGORY_COLORS: Record<string, { main: string; light: string }> = {
  people: { main: "#EC4899", light: "#FDF2F8" },
  food: { main: "#F97316", light: "#FFF7ED" },
  clothes: { main: "#0EA5E9", light: "#F0F9FF" },
  house: { main: "#8B5CF6", light: "#F5F3FF" },
  vehicle: { main: "#10B981", light: "#ECFDF5" },
  tools: { main: "#EAB308", light: "#FEFCE8" },
  date: { main: "#EC4899", light: "#FDF2F8" },
  time: { main: "#6366F1", light: "#EEF2FF" },
  location: { main: "#14B8A6", light: "#F0FDFA" },
  facility: { main: "#EF4444", light: "#FEF2F2" },
  body: { main: "#F43F5E", light: "#FFF1F2" },
  nature: { main: "#22C55E", light: "#F0FDF4" },
  condition: { main: "#0EA5E9", light: "#F0F9FF" },
  work: { main: "#A855F7", light: "#FAF5FF" },
  numbers: { main: "#D946EF", light: "#FDF4FF" },
  adjectives: { main: "#F59E0B", light: "#FFFBEB" },
  verbs: { main: "#3B82F6", light: "#EFF6FF" },
};

// =============================================================================
// MAPEO DE RECURSOS (Imágenes y Audio)
// =============================================================================

const PEOPLE_IMAGES: Record<number, any> = {
  1: require("@/assets/vocab/image/personas/1.webp"),
  2: require("@/assets/vocab/image/personas/2.webp"),
  // ... añadir resto
};

const CATEGORY_IMAGES: Record<string, Record<number, any>> = {
  people: PEOPLE_IMAGES,
};

const PEOPLE_AUDIO: Record<number, any> = {
  1: require("@/assets/vocab/audio/personas/1.wav"),
  2: require("@/assets/vocab/audio/personas/2.wav"),
  6: require("@/assets/vocab/audio/personas/6.wav"),
  // ... añadir resto
};

const PEOPLE_EXAMPLE_AUDIO: Record<number, any> = {
  1: require("@/assets/vocab/audio/personas/h_1.wav"),
  // ... añadir resto
};

const CATEGORY_AUDIO: Record<string, Record<number, any>> = {
  people: PEOPLE_AUDIO,
};

const CATEGORY_EXAMPLE_AUDIO: Record<string, Record<number, any>> = {
  people: PEOPLE_EXAMPLE_AUDIO,
};

// =============================================================================
// HELPERS
// =============================================================================

const getWordImage = (wordId: string, categoryId: string): any | null => {
  const categoryWords = VOCAB_DATA[categoryId];
  if (!categoryWords) return null;
  const wordIndex = categoryWords.findIndex((w) => w.id === wordId);
  if (wordIndex === -1) return null;
  const categoryImages = CATEGORY_IMAGES[categoryId];
  if (!categoryImages || !categoryImages[wordIndex + 1]) return null;
  return categoryImages[wordIndex + 1];
};

const getWordAudio = (wordId: string, categoryId: string): any | null => {
  const categoryWords = VOCAB_DATA[categoryId];
  if (!categoryWords) return null;
  const wordIndex = categoryWords.findIndex((w) => w.id === wordId);
  if (wordIndex === -1) return null;
  const categoryAudios = CATEGORY_AUDIO[categoryId];
  if (!categoryAudios || !categoryAudios[wordIndex + 1]) return null;
  return categoryAudios[wordIndex + 1];
};

const getExampleAudio = (wordId: string, categoryId: string): any | null => {
  const categoryWords = VOCAB_DATA[categoryId];
  if (!categoryWords) return null;
  const wordIndex = categoryWords.findIndex((w) => w.id === wordId);
  if (wordIndex === -1) return null;
  const categoryAudios = CATEGORY_EXAMPLE_AUDIO[categoryId];
  if (!categoryAudios || !categoryAudios[wordIndex + 1]) return null;
  return categoryAudios[wordIndex + 1];
};

const getCategoryFromId = (wordId: string): string => {
  const prefix = wordId.substring(0, 2);
  const categoryMap: Record<string, string> = {
    p0: "people",
    f0: "food",
    c0: "clothes",
    h0: "house",
    v0: "vehicle",
    t0: "tools",
    d0: "date",
    tm: "time",
    lo: "location",
    fa: "facility",
    b0: "body",
    n0: "nature",
    co: "condition",
    w0: "work",
    ad: "adjectives",
    vb: "verbs",
  };
  return categoryMap[prefix] || "people";
};

// =============================================================================
// COMPONENTE: BARRA DE AUDIO INDIVIDUAL (Reanimated)
// =============================================================================

const WaveBar = ({
  height,
  color,
  index,
  totalBars,
  progressSv,
  isPlaying,
}: {
  height: number;
  color: string;
  index: number;
  totalBars: number;
  progressSv: SharedValue<number>; // <--- Corregido: Tipo directo
  isPlaying: boolean;
}) => {
  const barThreshold = index / totalBars;

  const animatedStyle = useAnimatedStyle(() => {
    // Verificación reactiva en UI thread
    const isPassed = progressSv.value > barThreshold;

    // Efecto de escala "viva" cuando está reproduciendo
    const scale =
      isPlaying && isPassed ? 1 + Math.sin(Date.now() / 150 + index) * 0.15 : 1;

    return {
      backgroundColor: isPassed ? color : `${color}30`,
      transform: [{ scaleY: withTiming(scale, { duration: 100 }) }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          height: `${height * 100}%`,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
};

// =============================================================================
// COMPONENTE: FORMA DE ONDA (Contenedor)
// =============================================================================

const AudioWaveform = ({
  isPlaying,
  color,
  progressSv,
}: {
  isPlaying: boolean;
  color: string;
  progressSv: SharedValue<number>; // <--- Corregido: Tipo directo
}) => {
  const BAR_COUNT = 40;

  const waveformData = useMemo(() => {
    const data: number[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      // Simulación de onda de audio natural
      const position = i / BAR_COUNT;
      const base = 0.3;
      const variation =
        Math.sin(position * Math.PI * 4) * 0.2 + Math.random() * 0.3;
      data.push(Math.max(0.2, Math.min(1, base + variation)));
    }
    return data;
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 40,
        gap: 3,
        flex: 1,
      }}
    >
      {waveformData.map((height, index) => (
        <WaveBar
          key={index}
          index={index}
          totalBars={BAR_COUNT}
          height={height}
          color={color}
          progressSv={progressSv}
          isPlaying={isPlaying}
        />
      ))}
    </View>
  );
};

// =============================================================================
// COMPONENTE: REPRODUCTOR DE AUDIO (Lógica Principal)
// =============================================================================

const AudioPlayer = ({
  audioSource,
  color,
}: {
  audioSource: any | null;
  color: string;
}) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // SharedValue para rendimiento fluido (60fps)
  const progressSv = useSharedValue(0);

  useEffect(() => {
    if (!audioSource) return;

    let soundInstance: Sound | null = null;

    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          audioSource,
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              // Actualizamos el estado de React solo para play/pause
              setIsPlaying(status.isPlaying);

              // Actualizamos el SharedValue para la animación fluida
              if (status.durationMillis) {
                progressSv.value =
                  status.positionMillis / status.durationMillis;
              }

              if (status.didJustFinish) {
                setIsPlaying(false);
                progressSv.value = 0;
              }
            }
          }
        );

        // CLAVE: Intervalo bajo para suavidad "líquida"
        await newSound.setProgressUpdateIntervalAsync(60);

        soundInstance = newSound;
        setSound(newSound);
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadSound();

    return () => {
      if (soundInstance) soundInstance.unloadAsync();
    };
  }, [audioSource]);

  const handlePress = useCallback(async () => {
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
        } else {
          if (status.positionMillis === status.durationMillis) {
            await sound.setPositionAsync(0);
          }
          await sound.playAsync();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [sound]);

  if (!audioSource) return null;

  return (
    <Pressable onPress={handlePress} style={{ width: "100%" }}>
      <Animated.View
        style={{
          backgroundColor: `${color}10`,
          borderRadius: 12,
          paddingVertical: 4,
          paddingHorizontal: 12, // Un poco más de espacio a los lados
          justifyContent: "center", // Centrado
          height: 64, // Altura fija para buen tacto
        }}
      >
        {/* Solo dejamos la onda, sin iconos */}
        <AudioWaveform
          isPlaying={isPlaying}
          color={color}
          progressSv={progressSv}
        />
      </Animated.View>
    </Pressable>
  );
};

// =============================================================================
// COMPONENTE: TARJETA DE EJEMPLO (Con Blur Reveal)
// =============================================================================

const ExampleCard = ({
  japanese,
  translation,
  audioSource,
  color,
  highlightWord,
}: {
  japanese: string;
  translation?: string;
  audioSource?: any;
  color: string;
  highlightWord?: string;
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Controla la opacidad de la capa de blur
  const blurOpacity = useSharedValue(1);

  const handleReveal = useCallback(() => {
    const nextState = !isRevealed;
    setIsRevealed(nextState);

    blurOpacity.value = withTiming(nextState ? 0 : 1, {
      duration: 350,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isRevealed]);

  const blurContainerStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
    // Cuando la opacidad es 0, enviamos la capa al fondo para que no bloquee interacciones
    zIndex: blurOpacity.value === 0 ? -1 : 10,
  }));

  const renderHighlightedText = () => {
    if (!highlightWord || !japanese.includes(highlightWord)) {
      return (
        <Text
          style={{
            fontFamily: "NotoSansJP_400Regular",
            fontSize: 17,
            color: "#374151",
            lineHeight: 28,
          }}
        >
          {japanese}
        </Text>
      );
    }
    const parts = japanese.split(highlightWord);
    return (
      <Text
        style={{
          fontFamily: "NotoSansJP_400Regular",
          fontSize: 17,
          color: "#374151",
          lineHeight: 28,
        }}
      >
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <Text style={{ color: color }}>{highlightWord}</Text>
            )}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  return (
    <Surface
      style={{
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}
      elevation={0}
    >
      <View style={{ padding: 16 }}>{renderHighlightedText()}</View>

      {translation && (
        <Pressable onPress={handleReveal}>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
              position: "relative",
            }}
          >
            <View
              style={{ padding: 16, minHeight: 60, justifyContent: "center" }}
            >
              <Text
                style={{
                  fontFamily: "NotoSansJP_400Regular",
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 22,
                }}
              >
                {translation}
              </Text>
            </View>

            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                },
                blurContainerStyle,
              ]}
            >
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
              />

              <BlurView
                intensity={40}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </Pressable>
      )}

      {audioSource && (
        <View
          style={{ borderTopWidth: 1, borderTopColor: "#E5E7EB", padding: 12 }}
        >
          <AudioPlayer audioSource={audioSource} color={color} />
        </View>
      )}
    </Surface>
  );
};

// =============================================================================
// PANTALLA PRINCIPAL
// =============================================================================

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const wordId = typeof id === "string" ? id : "";

  const word = useMemo(() => getWordById(wordId), [wordId]);
  const categoryId = word ? getCategoryFromId(word.id) : "people";

  const wordImage = word ? getWordImage(word.id, categoryId) : null;
  const wordAudio = word ? getWordAudio(word.id, categoryId) : null;
  const exampleAudio = word ? getExampleAudio(word.id, categoryId) : null;

  const categoryColor = CATEGORY_COLORS[categoryId] || {
    main: THEME_COLOR,
    light: THEME_LIGHT,
  };

  if (!word) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "NotoSansJP_400Regular",
            fontSize: 16,
            color: "#6B7280",
          }}
        >
          Palabra no encontrada
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 16,
            backgroundColor: THEME_COLOR,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 14,
              color: "#FFFFFF",
            }}
          >
            戻る
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: PADDING,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta principal */}
        <Surface
          style={{
            borderRadius: 24,
            backgroundColor: categoryColor.light,
            overflow: "hidden",
          }}
          elevation={0}
        >
          {wordImage && (
            <>
              <View style={{ padding: 24, alignItems: "center" }}>
                <Image
                  source={wordImage}
                  style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: categoryColor.main,
                  opacity: 0.15,
                  marginHorizontal: 24,
                }}
              />
            </>
          )}

          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: wordImage ? 20 : 28,
              paddingBottom: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 52,
                color: categoryColor.main,
                textAlign: "center",
                includeFontPadding: false,
              }}
            >
              {word.japanese}
            </Text>

            {wordAudio && (
              <View style={{ marginTop: 20, width: "100%" }}>
                <AudioPlayer
                  audioSource={wordAudio}
                  color={categoryColor.main}
                />
              </View>
            )}
          </View>
        </Surface>

        {/* Ejemplo con Blur */}
        {word.example && (
          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 15,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              例文
            </Text>
            <ExampleCard
              japanese={word.example}
              translation={word.exampleMeaning}
              audioSource={exampleAudio}
              color={categoryColor.main}
              highlightWord={word.japanese}
            />
          </View>
        )}

        {/* Botón de práctica */}
        <View style={{ marginTop: 24 }}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: categoryColor.main,
              paddingVertical: 16,
              borderRadius: 14,
              gap: 10,
            }}
            onPress={() =>
              router.push(`/modules/vocab/practice/${categoryId}` as any)
            }
          >
            <BookOpen size={20} color="#FFFFFF" strokeWidth={2} />
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              練習を始める
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
