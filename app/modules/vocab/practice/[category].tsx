// app/modules/vocab/practice/[category].tsx
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { View, Dimensions, Pressable, Animated } from "react-native";
import { Text, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  Check,
  X as XIcon,
  Eye,
  EyeOff,
} from "lucide-react-native";

// Importar datos
import { VOCAB_DATA, VocabWord, getCategoryById } from "@/src/data/vocabData";

const { width, height } = Dimensions.get("window");

// Colores
const THEME_COLOR = "#F5A238";
const CORRECT_COLOR = "#22C55E";
const INCORRECT_COLOR = "#EF4444";

// Colores por categoría
const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; accent: string }
> = {
  people: { bg: "#FFF0F5", text: "#DB2777", accent: "#EC4899" },
  food: { bg: "#FEF3E2", text: "#EA580C", accent: "#F97316" },
  clothes: { bg: "#F0F9FF", text: "#0369A1", accent: "#0EA5E9" },
  house: { bg: "#F5F3FF", text: "#7C3AED", accent: "#8B5CF6" },
  vehicle: { bg: "#ECFDF5", text: "#059669", accent: "#10B981" },
  tools: { bg: "#FEF9C3", text: "#CA8A04", accent: "#EAB308" },
  date: { bg: "#FCE7F3", text: "#BE185D", accent: "#EC4899" },
  time: { bg: "#E0E7FF", text: "#4338CA", accent: "#6366F1" },
  location: { bg: "#CCFBF1", text: "#0D9488", accent: "#14B8A6" },
  facility: { bg: "#FEE2E2", text: "#DC2626", accent: "#EF4444" },
  body: { bg: "#FFE4E6", text: "#E11D48", accent: "#F43F5E" },
  nature: { bg: "#D1FAE5", text: "#047857", accent: "#10B981" },
  condition: { bg: "#E0F2FE", text: "#0284C7", accent: "#0EA5E9" },
  work: { bg: "#F3E8FF", text: "#9333EA", accent: "#A855F7" },
  numbers: { bg: "#FDF4FF", text: "#A21CAF", accent: "#D946EF" },
};

const PADDING = 20;
const CARD_HEIGHT = height * 0.45;

// Componente de botón de acción
const ActionButton = ({
  icon: Icon,
  color,
  bgColor,
  onPress,
  size = 48,
}: {
  icon: any;
  color: string;
  bgColor: string;
  onPress: () => void;
  size?: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Icon size={size * 0.45} color={color} strokeWidth={2.5} />
      </Animated.View>
    </Pressable>
  );
};

// Componente de Flashcard - Rediseñado
const Flashcard = ({
  word,
  isFlipped,
  onFlip,
  colors,
}: {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
  colors: { bg: string; text: string; accent: string };
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [isFlipped]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  // Interpolaciones
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const cardWidth = width - PADDING * 2;

  return (
    <Pressable
      onPress={onFlip}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          width: cardWidth,
          height: CARD_HEIGHT,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Cara frontal - Palabra japonesa */}
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: [{ rotateY: frontInterpolate }],
            opacity: frontOpacity,
          }}
        >
          <Surface
            style={{
              flex: 1,
              borderRadius: 28,
              backgroundColor: "#FFFFFF",
              borderWidth: 2,
              borderColor: colors.bg,
              overflow: "hidden",
            }}
            elevation={2}
          >
            {/* Decoración de fondo */}
            <View
              style={{
                position: "absolute",
                right: -20,
                top: -20,
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: colors.accent,
                opacity: 0.06,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: -30,
                bottom: -30,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.accent,
                opacity: 0.04,
              }}
            />

            {/* Contenido centrado */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              {/* Palabra japonesa */}
              <Text
                style={{
                  fontFamily: "NotoSansJP_700Bold",
                  fontSize: 52,
                  color: colors.text,
                  textAlign: "center",
                  includeFontPadding: false,
                }}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {word.japanese}
              </Text>

              {/* Lectura */}
              {word.reading && word.reading !== word.japanese && (
                <Text
                  style={{
                    fontFamily: "NotoSansJP_400Regular",
                    fontSize: 20,
                    color: colors.accent,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  {word.reading}
                </Text>
              )}
            </View>
          </Surface>
        </Animated.View>

        {/* Cara trasera - Significado */}
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: [{ rotateY: backInterpolate }],
            opacity: backOpacity,
          }}
        >
          <Surface
            style={{
              flex: 1,
              borderRadius: 28,
              backgroundColor: colors.bg,
              borderWidth: 2,
              borderColor: colors.accent,
              overflow: "hidden",
            }}
            elevation={2}
          >
            {/* Contenido */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              {/* Significado */}
              <Text
                style={{
                  fontFamily: "NotoSansJP_700Bold",
                  fontSize: 28,
                  color: colors.text,
                  textAlign: "center",
                  includeFontPadding: false,
                }}
                numberOfLines={3}
                adjustsFontSizeToFit
              >
                {word.meaning}
              </Text>

              {/* Palabra japonesa pequeña */}
              <View
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTopWidth: 1,
                  borderTopColor: `${colors.accent}30`,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "NotoSansJP_400Regular",
                    fontSize: 18,
                    color: colors.text,
                    opacity: 0.7,
                  }}
                >
                  {word.japanese}
                </Text>
                {word.reading && word.reading !== word.japanese && (
                  <Text
                    style={{
                      fontFamily: "NotoSansJP_400Regular",
                      fontSize: 14,
                      color: colors.text,
                      opacity: 0.5,
                      marginTop: 4,
                    }}
                  >
                    {word.reading}
                  </Text>
                )}
              </View>

              {/* Ejemplo */}
              {word.example && (
                <View
                  style={{
                    marginTop: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "NotoSansJP_400Regular",
                      fontSize: 14,
                      color: "#4B5563",
                      textAlign: "center",
                    }}
                    numberOfLines={2}
                  >
                    {word.example}
                  </Text>
                  {word.exampleMeaning && (
                    <Text
                      style={{
                        fontFamily: "NotoSansJP_400Regular",
                        fontSize: 12,
                        color: "#9CA3AF",
                        textAlign: "center",
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                      numberOfLines={2}
                    >
                      {word.exampleMeaning}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </Surface>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default function PracticeScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const categoryId = typeof category === "string" ? category : "people";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [unknownWords, setUnknownWords] = useState<Set<string>>(new Set());
  const [showProgress, setShowProgress] = useState(true);

  // Obtener datos
  const categoryData = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const colors = CATEGORY_COLORS[categoryId] || CATEGORY_COLORS.people;

  // Inicializar palabras
  useEffect(() => {
    const categoryWords = VOCAB_DATA[categoryId] || [];
    setWords(categoryWords);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownWords(new Set());
    setUnknownWords(new Set());
  }, [categoryId]);

  // Palabra actual
  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? (currentIndex + 1) / words.length : 0;

  // Handlers
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, words.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleKnown = useCallback(() => {
    if (currentWord) {
      setKnownWords((prev) => new Set(prev).add(currentWord.id));
      unknownWords.delete(currentWord.id);
      handleNext();
    }
  }, [currentWord, handleNext, unknownWords]);

  const handleUnknown = useCallback(() => {
    if (currentWord) {
      setUnknownWords((prev) => new Set(prev).add(currentWord.id));
      knownWords.delete(currentWord.id);
      handleNext();
    }
  }, [currentWord, handleNext, knownWords]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [words]);

  const handleBack = () => {
    router.back();
  };

  if (!currentWord || words.length === 0) {
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
          No hay palabras en esta categoría
        </Text>
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

      {/* Header simplificado */}
      <View
        style={{
          alignItems: "center",
          paddingHorizontal: PADDING,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            fontFamily: "NotoSansJP_700Bold",
            fontSize: 20,
            color: colors.text,
          }}
        >
          {categoryData?.titleJp || "練習"}
        </Text>
        <Text
          style={{
            fontFamily: "NotoSansJP_400Regular",
            fontSize: 13,
            color: "#9CA3AF",
            marginTop: 2,
          }}
        >
          {currentIndex + 1} / {words.length}
        </Text>
      </View>

      {/* Barra de progreso */}
      <View style={{ paddingHorizontal: PADDING, marginBottom: 16 }}>
        <View
          style={{
            height: 6,
            backgroundColor: "#F3F4F6",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: colors.accent,
              borderRadius: 3,
            }}
          />
        </View>

        {/* Estadísticas */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: CORRECT_COLOR,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              Conocidas: {knownWords.size}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: INCORRECT_COLOR,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              Por repasar: {unknownWords.size}
            </Text>
          </View>
        </View>
      </View>

      {/* Flashcard */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: PADDING,
        }}
      >
        <Flashcard
          word={currentWord}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          colors={colors}
        />
      </View>

      {/* Controles */}
      <View
        style={{
          paddingHorizontal: PADDING,
          paddingBottom: 24,
          paddingTop: 16,
        }}
      >
        {/* Botones de navegación y acción */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Botón anterior */}
          <ActionButton
            icon={ChevronLeft}
            color={currentIndex > 0 ? "#374151" : "#D1D5DB"}
            bgColor="#F3F4F6"
            onPress={handlePrevious}
            size={48}
          />

          {/* Botones de conocido/desconocido */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <ActionButton
              icon={XIcon}
              color="#FFFFFF"
              bgColor={INCORRECT_COLOR}
              onPress={handleUnknown}
              size={64}
            />
            <ActionButton
              icon={Check}
              color="#FFFFFF"
              bgColor={CORRECT_COLOR}
              onPress={handleKnown}
              size={64}
            />
          </View>

          {/* Botón siguiente */}
          <ActionButton
            icon={ChevronRight}
            color={currentIndex < words.length - 1 ? "#374151" : "#D1D5DB"}
            bgColor="#F3F4F6"
            onPress={handleNext}
            size={48}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
