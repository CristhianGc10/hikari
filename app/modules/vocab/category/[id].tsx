// app/modules/vocab/category/[id].tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import { Text, Surface, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Volume2,
  BookmarkPlus,
  Check,
  Search,
  X,
  Shuffle,
  GraduationCap,
} from "lucide-react-native";

// Importar datos de vocabulario
import { VOCAB_DATA, VocabWord, getCategoryById } from "@/src/data/vocabData";

const { width } = Dimensions.get("window");

// Color base del módulo (N5)
const THEME_COLOR = "#F5A238";
const THEME_LIGHT = "#FEF7ED";

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
  adjectives: { bg: "#FEF3C7", text: "#D97706", accent: "#F59E0B" },
  verbs: { bg: "#DBEAFE", text: "#2563EB", accent: "#3B82F6" },
};

const PADDING = 20;

// Componente de tarjeta de palabra
const WordCard = ({
  word,
  colors,
  onPress,
  isLearned,
}: {
  word: VocabWord;
  colors: { bg: string; text: string; accent: string };
  onPress: () => void;
  isLearned: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Surface
        style={{
          marginHorizontal: PADDING,
          marginBottom: 10,
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: isLearned ? colors.accent : "#F3F4F6",
        }}
        elevation={0}
      >
        <TouchableRipple
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          rippleColor={`${colors.accent}20`}
          style={{ padding: 16 }}
        >
          <View>
            {/* Fila principal */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                {/* Palabra japonesa */}
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <Text
                    style={{
                      fontFamily: "NotoSansJP_700Bold",
                      fontSize: 22,
                      color: colors.text,
                    }}
                  >
                    {word.japanese}
                  </Text>
                  {word.reading && word.reading !== word.japanese && (
                    <Text
                      style={{
                        fontFamily: "NotoSansJP_400Regular",
                        fontSize: 14,
                        color: "#9CA3AF",
                        marginLeft: 8,
                      }}
                    >
                      {word.reading}
                    </Text>
                  )}
                </View>

                {/* Significado */}
                <Text
                  style={{
                    fontFamily: "NotoSansJP_400Regular",
                    fontSize: 15,
                    color: "#4B5563",
                    marginTop: 4,
                  }}
                >
                  {word.meaning}
                </Text>

                {/* Ejemplo (si existe) */}
                {word.example && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderTopColor: "#F3F4F6",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "NotoSansJP_400Regular",
                        fontSize: 13,
                        color: "#6B7280",
                      }}
                    >
                      {word.example}
                    </Text>
                    {word.exampleMeaning && (
                      <Text
                        style={{
                          fontFamily: "NotoSansJP_400Regular",
                          fontSize: 12,
                          color: "#9CA3AF",
                          marginTop: 2,
                          fontStyle: "italic",
                        }}
                      >
                        {word.exampleMeaning}
                      </Text>
                    )}
                  </View>
                )}
              </View>

              {/* Indicador de aprendido */}
              {isLearned && (
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.accent,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 12,
                  }}
                >
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </View>
          </View>
        </TouchableRipple>
      </Surface>
    </Animated.View>
  );
};

// Header de la categoría - Estilo japonés dividido
const CategoryHeader = ({
  title,
  subtitle,
  wordCount,
  learnedCount,
  colors,
  onPractice,
  onShuffle,
}: {
  title: string;
  subtitle: string;
  wordCount: number;
  learnedCount: number;
  colors: { bg: string; text: string; accent: string };
  onPractice: () => void;
  onShuffle: () => void;
}) => {
  const progress = wordCount > 0 ? learnedCount / wordCount : 0;
  const remaining = wordCount - learnedCount;

  return (
    <Surface
      style={{
        marginHorizontal: PADDING,
        marginBottom: 16,
        borderRadius: 24,
        backgroundColor: colors.bg,
        overflow: "hidden",
      }}
      elevation={0}
    >
      {/* Contenedor principal dividido */}
      <View style={{ flexDirection: "row", minHeight: 140 }}>
        {/* Lado izquierdo - Título con kanji decorativo */}
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: "center",
          }}
        >
          {/* Kanji decorativo de fondo */}
          <Text
            style={{
              position: "absolute",
              right: -10,
              top: "50%",
              transform: [{ translateY: -45 }],
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 120,
              color: colors.accent,
              opacity: 0.08,
              includeFontPadding: false,
            }}
          >
            {title.charAt(0)}
          </Text>

          {/* Título */}
          <Text
            style={{
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 32,
              color: colors.text,
              includeFontPadding: false,
            }}
          >
            {title}
          </Text>

          {/* Subtítulo */}
          <Text
            style={{
              fontFamily: "NotoSansJP_400Regular",
              fontSize: 14,
              color: colors.text,
              opacity: 0.6,
              marginTop: 4,
            }}
          >
            {subtitle}
          </Text>

          {/* Barra de progreso mini */}
          <View
            style={{
              marginTop: 12,
              height: 4,
              width: "80%",
              backgroundColor: `${colors.accent}20`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor: colors.accent,
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        {/* Separador vertical sutil */}
        <View
          style={{
            width: 1,
            backgroundColor: colors.accent,
            opacity: 0.15,
            marginVertical: 20,
          }}
        />

        {/* Lado derecho - Estadísticas apiladas */}
        <View
          style={{
            width: 110,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Porcentaje grande */}
          <Text
            style={{
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 36,
              color: colors.accent,
              includeFontPadding: false,
              lineHeight: 40,
            }}
          >
            {Math.round(progress * 100)}
            <Text style={{ fontSize: 18 }}>%</Text>
          </Text>

          {/* Aprendidas */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.accent,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                fontFamily: "NotoSansJP_500Medium",
                fontSize: 13,
                color: colors.text,
                opacity: 0.8,
              }}
            >
              {learnedCount} 習得
            </Text>
          </View>

          {/* Restantes */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.accent,
                opacity: 0.3,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 13,
                color: colors.text,
                opacity: 0.5,
              }}
            >
              {remaining} 残り
            </Text>
          </View>
        </View>
      </View>

      {/* Botones de acción */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingBottom: 16,
          gap: 10,
        }}
      >
        {/* Botón Practicar */}
        <Pressable
          onPress={onPractice}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.accent,
            height: 46,
            borderRadius: 12,
            gap: 8,
          }}
        >
          <GraduationCap size={18} color="#FFFFFF" strokeWidth={2} />
          <Text
            style={{
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 15,
              color: "#FFFFFF",
            }}
          >
            練習を始める
          </Text>
        </Pressable>

        {/* Botón Aleatorio */}
        <Pressable
          onPress={onShuffle}
          style={{
            width: 46,
            height: 46,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
          }}
        >
          <Shuffle size={20} color={colors.accent} strokeWidth={2.5} />
        </Pressable>
      </View>
    </Surface>
  );
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const categoryId = typeof id === "string" ? id : "people";

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const inputRef = useRef<TextInput>(null);

  // Animación de búsqueda
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(searchAnim, {
      toValue: isSearchActive ? 1 : 0,
      useNativeDriver: false,
      tension: 65,
      friction: 11,
    }).start(() => {
      if (isSearchActive && inputRef.current) {
        inputRef.current.focus();
      }
    });
  }, [isSearchActive]);

  // Obtener datos de la categoría
  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const words = useMemo(() => VOCAB_DATA[categoryId] || [], [categoryId]);
  const colors = CATEGORY_COLORS[categoryId] || CATEGORY_COLORS.people;

  // Filtrar palabras por búsqueda
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return words;
    const query = searchQuery.toLowerCase();
    return words.filter(
      (word) =>
        word.japanese.includes(searchQuery) ||
        word.reading?.includes(searchQuery) ||
        word.meaning.toLowerCase().includes(query)
    );
  }, [words, searchQuery]);

  const handleWordPress = (word: VocabWord) => {
    router.push(`/modules/vocab/word/${word.id}` as any);
  };

  const handlePractice = () => {
    router.push(`/modules/vocab/practice/${categoryId}` as any);
  };

  const handleShuffle = () => {
    // Navegar a práctica con modo aleatorio
    router.push(`/modules/vocab/practice/${categoryId}?shuffle=true` as any);
  };

  const handleToggleSearch = () => {
    if (isSearchActive) {
      Keyboard.dismiss();
      setSearchQuery("");
      setIsSearchActive(false);
    } else {
      setIsSearchActive(true);
    }
  };

  if (!category) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Categoría no encontrada</Text>
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

      {/* Header con título y búsqueda animada */}
      <View
        style={{ paddingHorizontal: PADDING, paddingTop: 10, paddingBottom: 8 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 44 }}
        >
          {/* Título - se oculta cuando la búsqueda está activa */}
          <Animated.View
            style={{
              opacity: searchAnim.interpolate({
                inputRange: [0, 0.3],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateX: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                },
              ],
              position: "absolute",
              left: 0,
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 24,
                color: colors.text,
              }}
            >
              {category.titleJp}
            </Text>
          </Animated.View>

          {/* Espaciador flexible */}
          <View style={{ flex: 1 }} />

          {/* Contenedor de búsqueda animado */}
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isSearchActive ? "#F3F4F6" : colors.bg,
              borderRadius: 12,
              height: 44,
              width: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [44, width - PADDING * 2],
              }),
              overflow: "hidden",
            }}
          >
            {/* Botón de lupa / cerrar */}
            <Pressable
              onPress={handleToggleSearch}
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "90deg"],
                      }),
                    },
                  ],
                }}
              >
                {isSearchActive ? (
                  <X size={20} color={colors.accent} strokeWidth={2.5} />
                ) : (
                  <Search size={20} color={colors.accent} strokeWidth={2.5} />
                )}
              </Animated.View>
            </Pressable>

            {/* Campo de texto */}
            <Animated.View
              style={{
                flex: 1,
                opacity: searchAnim.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [0, 1],
                  extrapolate: "clamp",
                }),
                marginRight: 12,
              }}
            >
              <TextInput
                ref={inputRef}
                placeholder="このカテゴリーで検索..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                style={{
                  fontFamily: "NotoSansJP_400Regular",
                  fontSize: 15,
                  color: "#1F2937",
                  height: 44,
                  paddingVertical: 0,
                }}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de categoría */}
        <CategoryHeader
          title={category.titleJp}
          subtitle={category.titleEs}
          wordCount={words.length}
          learnedCount={learnedWords.size}
          colors={colors}
          onPractice={handlePractice}
          onShuffle={handleShuffle}
        />

        {/* Contador de resultados si hay búsqueda */}
        {searchQuery.trim() && (
          <View style={{ paddingHorizontal: PADDING, marginBottom: 8 }}>
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 13,
                color: "#9CA3AF",
              }}
            >
              {filteredWords.length} resultado
              {filteredWords.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {/* Lista de palabras */}
        {filteredWords.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            colors={colors}
            onPress={() => handleWordPress(word)}
            isLearned={learnedWords.has(word.id)}
          />
        ))}

        {/* Mensaje si no hay resultados */}
        {filteredWords.length === 0 && (
          <View style={{ padding: PADDING * 2, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 14,
                color: "#9CA3AF",
                textAlign: "center",
              }}
            >
              No se encontraron palabras para "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
