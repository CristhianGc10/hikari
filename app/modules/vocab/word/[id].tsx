// app/modules/vocab/word/[id].tsx
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { View, ScrollView, Dimensions, Pressable, Image } from "react-native";
import { Text, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BookOpen, Languages } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

import { getWordById, VOCAB_DATA } from "@/src/data/vocabData";

import AudioWaveformPlayer from "@/src/components/audio/AudioWaveformPlayer";

const { width } = Dimensions.get("window");

// =============================================================================
// CONSTANTES Y COLORES
// =============================================================================

const THEME_COLOR = "#F5A238";
const THEME_LIGHT = "#FEF7ED";
const PADDING = 20;
const IMAGE_SIZE = width - PADDING * 2 - 48;

const LIQUID_WIDTH = width - PADDING * 2 - 48;
const LIQUID_HEIGHT = 70;

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
// MAPEO DE RECURSOS
// =============================================================================

const PEOPLE_IMAGES: Record<number, any> = {
  1: require("@/assets/vocab/image/personas/1.webp"),
  2: require("@/assets/vocab/image/personas/2.webp"),
};

const CATEGORY_IMAGES: Record<string, Record<number, any>> = {
  people: PEOPLE_IMAGES,
};

const PEOPLE_AUDIO: Record<number, any> = {
  1: require("@/assets/vocab/audio/personas/1.wav"),
  2: require("@/assets/vocab/audio/personas/2.wav"),
  6: require("@/assets/vocab/audio/personas/6.wav"),
};

const PEOPLE_EXAMPLE_AUDIO: Record<number, any> = {
  1: require("@/assets/vocab/audio/personas/h_1.wav"),
  2: require("@/assets/vocab/audio/personas/h_2.wav"),
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
// COMPONENTE: REPRODUCTOR DE AUDIO CON LIQUID VISUALIZER
// =============================================================================

const AudioPlayer = ({
  audioSource,
  color,
  visualizerWidth,
}: {
  audioSource: any | null;
  color: string;
  visualizerWidth?: number;
}) => {
  if (!audioSource) return null;

  return (
    <AudioWaveformPlayer
      source={audioSource}
      color={color}
      width={visualizerWidth || LIQUID_WIDTH}
      height={LIQUID_HEIGHT}
    />
  );
};

// =============================================================================
// COMPONENTE: TARJETA DE EJEMPLO
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
  const [showTranslation, setShowTranslation] = useState(false);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleToggleTranslation = useCallback(() => {
    const nextState = !showTranslation;

    translateX.value = withSequence(
      withTiming(nextState ? -5 : 5, { duration: 100 }),
      withTiming(0, { duration: 150, easing: Easing.out(Easing.ease) })
    );

    opacity.value = withSequence(
      withTiming(0.5, { duration: 80 }),
      withTiming(1, { duration: 150 })
    );

    setShowTranslation(nextState);
  }, [showTranslation]);

  const textAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const renderHighlightedText = () => {
    if (!highlightWord || !japanese.includes(highlightWord)) {
      return japanese;
    }

    const parts = japanese.split(highlightWord);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <Text style={{ color: "#374151" }}>{part}</Text>
            {index < parts.length - 1 && (
              <Text style={{ color: color, fontFamily: "NotoSansJP_700Bold" }}>
                {highlightWord}
              </Text>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const exampleVisualizerWidth = width - PADDING * 2 - 40;

  return (
    <Surface
      style={{
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F0F0F0",
      }}
      elevation={0}
    >
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Animated.View style={[{ flex: 1 }, textAnimStyle]}>
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 17,
                color: "#374151",
                lineHeight: 28,
              }}
            >
              {showTranslation ? translation : renderHighlightedText()}
            </Text>
          </Animated.View>

          {translation && (
            <Pressable
              onPress={handleToggleTranslation}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                marginLeft: 12,
                padding: 8,
                borderRadius: 10,
                backgroundColor: showTranslation ? color : `${color}12`,
              }}
            >
              <Languages
                size={18}
                color={showTranslation ? "#FFFFFF" : color}
                strokeWidth={2}
              />
            </Pressable>
          )}
        </View>
      </View>

      {audioSource && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <AudioPlayer
            audioSource={audioSource}
            color={color}
            visualizerWidth={exampleVisualizerWidth}
          />
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
              <View style={{ marginTop: 24 }}>
                <AudioPlayer
                  audioSource={wordAudio}
                  color={categoryColor.main}
                />
              </View>
            )}
          </View>
        </Surface>

        {/* Ejemplo */}
        {word.example && (
          <View style={{ marginTop: 24 }}>
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
