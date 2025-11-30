// app/modules/vocab/word/[id].tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";
import { Text, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Volume2,
  BookmarkPlus,
  Bookmark,
  Check,
  BookOpen,
  MessageCircle,
  Lightbulb,
} from "lucide-react-native";

// Importar datos
import { getWordById, VocabWord, VOCAB_CATEGORIES } from "@/src/data/vocabData";

const { width } = Dimensions.get("window");

// Color base del módulo
const THEME_COLOR = "#F5A238";
const THEME_LIGHT = "#FEF7ED";

const PADDING = 20;

// Componente de sección
const Section = ({
  title,
  icon: Icon,
  children,
  color = THEME_COLOR,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  color?: string;
}) => (
  <View style={{ marginBottom: 20 }}>
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: `${color}20`,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Icon size={18} color={color} strokeWidth={2} />
      </View>
      <Text
        style={{
          fontFamily: "NotoSansJP_700Bold",
          fontSize: 16,
          color: "#374151",
        }}
      >
        {title}
      </Text>
    </View>
    {children}
  </View>
);

// Componente de tarjeta de ejemplo
const ExampleCard = ({
  japanese,
  translation,
}: {
  japanese: string;
  translation?: string;
}) => (
  <Surface
    style={{
      borderRadius: 14,
      backgroundColor: "#F9FAFB",
      padding: 16,
      marginBottom: 10,
    }}
    elevation={0}
  >
    <Text
      style={{
        fontFamily: "NotoSansJP_400Regular",
        fontSize: 16,
        color: "#1F2937",
        lineHeight: 24,
      }}
    >
      {japanese}
    </Text>
    {translation && (
      <Text
        style={{
          fontFamily: "NotoSansJP_400Regular",
          fontSize: 14,
          color: "#6B7280",
          marginTop: 8,
          fontStyle: "italic",
        }}
      >
        {translation}
      </Text>
    )}
  </Surface>
);

// Componente de chip de tag
const TagChip = ({ label, color }: { label: string; color: string }) => (
  <View
    style={{
      backgroundColor: `${color}15`,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
    }}
  >
    <Text
      style={{
        fontFamily: "NotoSansJP_400Regular",
        fontSize: 13,
        color: color,
      }}
    >
      {label}
    </Text>
  </View>
);

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const wordId = typeof id === "string" ? id : "";

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLearned, setIsLearned] = useState(false);

  // Animaciones
  const bookmarkAnim = useRef(new Animated.Value(1)).current;
  const learnedAnim = useRef(new Animated.Value(1)).current;

  // Obtener palabra
  const word = useMemo(() => getWordById(wordId), [wordId]);

  // Handlers
  const handleBack = () => {
    router.back();
  };

  const handleBookmark = () => {
    Animated.sequence([
      Animated.spring(bookmarkAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(bookmarkAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
    setIsBookmarked((prev) => !prev);
  };

  const handleMarkLearned = () => {
    Animated.sequence([
      Animated.spring(learnedAnim, {
        toValue: 1.2,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(learnedAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
    setIsLearned((prev) => !prev);
  };

  // Función para determinar la categoría basándose en el ID
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
          onPress={handleBack}
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
            Volver
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const categoryId = getCategoryFromId(word.id);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: PADDING,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        {/* Botón atrás */}
        <Pressable
          onPress={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#F3F4F6",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={24} color="#374151" strokeWidth={2} />
        </Pressable>

        {/* Acciones */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {/* Botón bookmark */}
          <Pressable onPress={handleBookmark}>
            <Animated.View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: isBookmarked ? THEME_COLOR : "#F3F4F6",
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: bookmarkAnim }],
              }}
            >
              {isBookmarked ? (
                <Bookmark
                  size={20}
                  color="#FFFFFF"
                  strokeWidth={2}
                  fill="#FFFFFF"
                />
              ) : (
                <BookmarkPlus size={20} color="#6B7280" strokeWidth={2} />
              )}
            </Animated.View>
          </Pressable>

          {/* Botón aprendido */}
          <Pressable onPress={handleMarkLearned}>
            <Animated.View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: isLearned ? "#22C55E" : "#F3F4F6",
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: learnedAnim }],
              }}
            >
              <Check
                size={20}
                color={isLearned ? "#FFFFFF" : "#6B7280"}
                strokeWidth={2.5}
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: PADDING,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta principal */}
        <Surface
          style={{
            borderRadius: 24,
            backgroundColor: THEME_LIGHT,
            padding: 24,
            marginBottom: 24,
            alignItems: "center",
          }}
          elevation={0}
        >
          {/* Palabra japonesa */}
          <Text
            style={{
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 56,
              color: THEME_COLOR,
              textAlign: "center",
            }}
          >
            {word.japanese}
          </Text>

          {/* Lectura */}
          {word.reading && word.reading !== word.japanese && (
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 22,
                color: "#9CA3AF",
                marginTop: 8,
              }}
            >
              {word.reading}
            </Text>
          )}

          {/* Significado */}
          <View
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: `${THEME_COLOR}30`,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 24,
                color: "#374151",
                textAlign: "center",
              }}
            >
              {word.meaning}
            </Text>
          </View>

          {/* Botón de audio (placeholder) */}
          <Pressable
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              gap: 8,
            }}
          >
            <Volume2 size={20} color={THEME_COLOR} strokeWidth={2} />
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 14,
                color: THEME_COLOR,
              }}
            >
              Escuchar pronunciación
            </Text>
          </Pressable>
        </Surface>

        {/* Sección de ejemplo */}
        {word.example && (
          <Section title="Ejemplo" icon={MessageCircle} color="#3B82F6">
            <ExampleCard
              japanese={word.example}
              translation={word.exampleMeaning}
            />
          </Section>
        )}

        {/* Sección de notas de estudio */}
        <Section title="Notas de estudio" icon={Lightbulb} color="#F59E0B">
          <Surface
            style={{
              borderRadius: 14,
              backgroundColor: "#FFFBEB",
              padding: 16,
            }}
            elevation={0}
          >
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 14,
                color: "#92400E",
                lineHeight: 22,
              }}
            >
              💡 Esta palabra es parte del vocabulario esencial para el JLPT N5.
              Practica usándola en oraciones simples para memorizarla mejor.
            </Text>
          </Surface>
        </Section>

        {/* Tags */}
        {word.tags && word.tags.length > 0 && (
          <Section title="Etiquetas" icon={BookOpen} color="#8B5CF6">
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {word.tags.map((tag, index) => (
                <TagChip key={index} label={tag} color="#8B5CF6" />
              ))}
            </View>
          </Section>
        )}

        {/* Acciones adicionales */}
        <View style={{ marginTop: 8 }}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: THEME_COLOR,
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
              Practicar esta categoría
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
