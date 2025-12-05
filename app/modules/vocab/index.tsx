// app/modules/vocab/index.tsx
import React, { useState, useRef, useEffect } from "react";
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
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  BookOpen,
  Users,
  Utensils,
  Shirt,
  Home,
  Car,
  Wrench,
  Calendar,
  MapPin,
  Building2,
  Heart,
  Leaf,
  Sparkles,
  Briefcase,
  Hash,
  Search,
  X,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// Color base del módulo (N5)
const THEME_COLOR = "#F5A238";
const THEME_LIGHT = "#FEF7ED";

// Colores por categoría - Paleta vibrante y armónica
const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  people: { bg: "#FFF0F5", text: "#DB2777", icon: "#EC4899" },
  food: { bg: "#FEF3E2", text: "#EA580C", icon: "#F97316" },
  clothes: { bg: "#F0F9FF", text: "#0369A1", icon: "#0EA5E9" },
  house: { bg: "#F5F3FF", text: "#7C3AED", icon: "#8B5CF6" },
  vehicle: { bg: "#ECFDF5", text: "#059669", icon: "#10B981" },
  tools: { bg: "#FEF9C3", text: "#CA8A04", icon: "#EAB308" },
  date: { bg: "#FCE7F3", text: "#BE185D", icon: "#EC4899" },
  time: { bg: "#E0E7FF", text: "#4338CA", icon: "#6366F1" },
  location: { bg: "#CCFBF1", text: "#0D9488", icon: "#14B8A6" },
  facility: { bg: "#FEE2E2", text: "#DC2626", icon: "#EF4444" },
  body: { bg: "#FFE4E6", text: "#E11D48", icon: "#F43F5E" },
  nature: { bg: "#D1FAE5", text: "#047857", icon: "#10B981" },
  condition: { bg: "#E0F2FE", text: "#0284C7", icon: "#0EA5E9" },
  work: { bg: "#F3E8FF", text: "#9333EA", icon: "#A855F7" },
  numbers: { bg: "#FDF4FF", text: "#A21CAF", icon: "#D946EF" },
};

// Iconos por categoría
const CATEGORY_ICONS: Record<string, any> = {
  people: Users,
  food: Utensils,
  clothes: Shirt,
  house: Home,
  vehicle: Car,
  tools: Wrench,
  date: Calendar,
  time: Calendar,
  location: MapPin,
  facility: Building2,
  body: Heart,
  nature: Leaf,
  condition: Sparkles,
  work: Briefcase,
  numbers: Hash,
};

type VocabCategory = {
  id: string;
  titleJp: string;
  titleEs: string;
  icon: keyof typeof CATEGORY_ICONS;
  wordCount: number;
  progress: number;
};

// Categorías del vocabulario N5
const CATEGORIES: VocabCategory[] = [
  {
    id: "people",
    titleJp: "人",
    titleEs: "Personas",
    icon: "people",
    wordCount: 43,
    progress: 0,
  },
  {
    id: "food",
    titleJp: "食べ物",
    titleEs: "Comida",
    icon: "food",
    wordCount: 41,
    progress: 0,
  },
  {
    id: "clothes",
    titleJp: "服",
    titleEs: "Ropa",
    icon: "clothes",
    wordCount: 16,
    progress: 0,
  },
  {
    id: "house",
    titleJp: "家",
    titleEs: "Casa",
    icon: "house",
    wordCount: 17,
    progress: 0,
  },
  {
    id: "vehicle",
    titleJp: "乗り物",
    titleEs: "Transporte",
    icon: "vehicle",
    wordCount: 11,
    progress: 0,
  },
  {
    id: "tools",
    titleJp: "道具",
    titleEs: "Herramientas",
    icon: "tools",
    wordCount: 22,
    progress: 0,
  },
  {
    id: "date",
    titleJp: "日付",
    titleEs: "Fechas",
    icon: "date",
    wordCount: 30,
    progress: 0,
  },
  {
    id: "time",
    titleJp: "時間",
    titleEs: "Tiempo",
    icon: "time",
    wordCount: 29,
    progress: 0,
  },
  {
    id: "location",
    titleJp: "位置",
    titleEs: "Ubicación",
    icon: "location",
    wordCount: 20,
    progress: 0,
  },
  {
    id: "facility",
    titleJp: "施設",
    titleEs: "Lugares",
    icon: "facility",
    wordCount: 31,
    progress: 0,
  },
  {
    id: "body",
    titleJp: "体",
    titleEs: "Cuerpo",
    icon: "body",
    wordCount: 17,
    progress: 0,
  },
  {
    id: "nature",
    titleJp: "自然",
    titleEs: "Naturaleza",
    icon: "nature",
    wordCount: 18,
    progress: 0,
  },
  {
    id: "condition",
    titleJp: "状態",
    titleEs: "Estados",
    icon: "condition",
    wordCount: 22,
    progress: 0,
  },
  {
    id: "work",
    titleJp: "仕事",
    titleEs: "Trabajo y Estudio",
    icon: "work",
    wordCount: 38,
    progress: 0,
  },
  {
    id: "numbers",
    titleJp: "数字",
    titleEs: "Números",
    icon: "numbers",
    wordCount: 80,
    progress: 0,
  },
];

// Grid config
// Grid config
const PADDING = 20;
const GAP = 12;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - PADDING * 2 - GAP) / NUM_COLUMNS;

// Border radius por categoría - diseño orgánico
const CATEGORY_BORDER_RADIUS: Record<
  string,
  {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  }
> = {
  people: { topLeft: 20, topRight: 12, bottomLeft: 14, bottomRight: 22 },
  food: { topLeft: 14, topRight: 20, bottomLeft: 18, bottomRight: 12 },
  clothes: { topLeft: 18, topRight: 14, bottomLeft: 12, bottomRight: 20 },
  house: { topLeft: 12, topRight: 22, bottomLeft: 20, bottomRight: 14 },
  vehicle: { topLeft: 22, topRight: 16, bottomLeft: 14, bottomRight: 18 },
  tools: { topLeft: 16, topRight: 12, bottomLeft: 22, bottomRight: 16 },
  date: { topLeft: 14, topRight: 18, bottomLeft: 16, bottomRight: 22 },
  time: { topLeft: 20, topRight: 14, bottomLeft: 18, bottomRight: 14 },
  location: { topLeft: 12, topRight: 20, bottomLeft: 14, bottomRight: 18 },
  facility: { topLeft: 18, topRight: 22, bottomLeft: 12, bottomRight: 16 },
  body: { topLeft: 16, topRight: 14, bottomLeft: 20, bottomRight: 12 },
  nature: { topLeft: 22, topRight: 18, bottomLeft: 16, bottomRight: 20 },
  condition: { topLeft: 14, topRight: 16, bottomLeft: 22, bottomRight: 14 },
  work: { topLeft: 18, topRight: 20, bottomLeft: 14, bottomRight: 18 },
  numbers: { topLeft: 20, topRight: 12, bottomLeft: 18, bottomRight: 22 },
  adjectives: { topLeft: 12, topRight: 18, bottomLeft: 20, bottomRight: 16 },
  verbs: { topLeft: 16, topRight: 22, bottomLeft: 12, bottomRight: 20 },
};

const getCategoryRadius = (categoryId: string) => {
  return (
    CATEGORY_BORDER_RADIUS[categoryId] || {
      topLeft: 16,
      topRight: 16,
      bottomLeft: 16,
      bottomRight: 16,
    }
  );
};

// Componente de tarjeta de categoría
const CategoryCard = ({
  category,
  onPress,
}: {
  category: VocabCategory;
  onPress: () => void;
}) => {
  const colors = CATEGORY_COLORS[category.id] || CATEGORY_COLORS.people;
  const IconComponent = CATEGORY_ICONS[category.icon] || BookOpen;

  return (
    <Surface
      style={{
        width: CARD_WIDTH,
        borderTopLeftRadius: getCategoryRadius(category.id).topLeft,
        borderTopRightRadius: getCategoryRadius(category.id).topRight,
        borderBottomLeftRadius: getCategoryRadius(category.id).bottomLeft,
        borderBottomRightRadius: getCategoryRadius(category.id).bottomRight,
        overflow: "hidden",
        backgroundColor: colors.bg,
      }}
      elevation={0}
    >
      <TouchableRipple
        onPress={onPress}
        rippleColor={`${colors.icon}20`}
        style={{
          padding: 16,
          borderTopLeftRadius: getCategoryRadius(category.id).topLeft,
          borderTopRightRadius: getCategoryRadius(category.id).topRight,
          borderBottomLeftRadius: getCategoryRadius(category.id).bottomLeft,
          borderBottomRightRadius: getCategoryRadius(category.id).bottomRight,
        }}
      >
        <View>
          {/* Icono y título japonés */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: Math.min(
                  getCategoryRadius(category.id).topLeft,
                  12
                ),
                backgroundColor: `${colors.icon}20`,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <IconComponent size={20} color={colors.icon} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 20,
                color: colors.text,
              }}
            >
              {category.titleJp}
            </Text>
          </View>

          {/* Título en español */}
          <Text
            style={{
              fontFamily: "NotoSansJP_400Regular",
              fontSize: 14,
              color: colors.text,
              opacity: 0.8,
              marginBottom: 8,
            }}
          >
            {category.titleEs}
          </Text>

          {/* Contador de palabras */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 12,
                color: colors.text,
                opacity: 0.6,
              }}
            >
              {category.wordCount} palabras
            </Text>

            {/* Barra de progreso mini */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: `${colors.icon}30`,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${category.progress * 100}%`,
                  height: "100%",
                  backgroundColor: colors.icon,
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

// Header con estadísticas
const StatsHeader = ({
  totalWords,
  learnedWords,
}: {
  totalWords: number;
  learnedWords: number;
}) => {
  const progress = totalWords > 0 ? learnedWords / totalWords : 0;

  return (
    <Surface
      style={{
        marginHorizontal: PADDING,
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: THEME_LIGHT,
        padding: 16,
      }}
      elevation={0}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Icono y título */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: THEME_COLOR,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <BookOpen size={24} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 18,
                color: "#1F2937",
              }}
            >
              語彙 N5
            </Text>
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 13,
                color: "#6B7280",
              }}
            >
              {learnedWords} / {totalWords} palabras
            </Text>
          </View>
        </View>

        {/* Progreso circular */}
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 24,
              color: THEME_COLOR,
            }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>

      {/* Barra de progreso */}
      <View
        style={{
          marginTop: 12,
          height: 8,
          backgroundColor: "#E5E7EB",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: THEME_COLOR,
            borderRadius: 4,
          }}
        />
      </View>
    </Surface>
  );
};

export default function VocabScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Animación para la barra de búsqueda
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(searchAnim, {
      toValue: isSearchActive ? 1 : 0,
      useNativeDriver: false,
      tension: 65,
      friction: 11,
    }).start(() => {
      // Focus en el input cuando la animación termina de abrir
      if (isSearchActive && inputRef.current) {
        inputRef.current.focus();
      }
    });
  }, [isSearchActive]);

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/modules/vocab/category/${categoryId}` as any);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/modules/vocab/search?q=${encodeURIComponent(searchQuery)}` as any
      );
    }
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

  // Total de palabras
  const totalWords = CATEGORIES.reduce((sum, cat) => sum + cat.wordCount, 0);
  const learnedWords = 0; // TODO: Conectar con el sistema de progreso

  // Filtrar categorías si hay búsqueda
  const filteredCategories = searchQuery.trim()
    ? CATEGORIES.filter(
        (cat) =>
          cat.titleJp.includes(searchQuery) ||
          cat.titleEs.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CATEGORIES;

  // Interpolaciones de animación
  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [44, width - PADDING * 2],
  });

  const titleOpacity = searchAnim.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const titleTranslateX = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const inputOpacity = searchAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const iconRotate = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

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
              opacity: titleOpacity,
              transform: [{ translateX: titleTranslateX }],
              position: "absolute",
              left: 0,
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 24,
                color: THEME_COLOR,
              }}
            >
              語彙
            </Text>
          </Animated.View>

          {/* Espaciador flexible */}
          <View style={{ flex: 1 }} />

          {/* Contenedor de búsqueda animado */}
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isSearchActive ? "#F3F4F6" : THEME_LIGHT,
              borderRadius: 12,
              height: 44,
              width: searchWidth,
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
                  transform: [{ rotate: iconRotate }],
                }}
              >
                {isSearchActive ? (
                  <X size={20} color={THEME_COLOR} strokeWidth={2.5} />
                ) : (
                  <Search size={20} color={THEME_COLOR} strokeWidth={2.5} />
                )}
              </Animated.View>
            </Pressable>

            {/* Campo de texto */}
            <Animated.View
              style={{
                flex: 1,
                opacity: inputOpacity,
                marginRight: 12,
              }}
            >
              <TextInput
                ref={inputRef}
                placeholder="単語を検索..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
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
        {/* Stats Header */}
        <View style={{ paddingTop: 8 }}>
          <StatsHeader totalWords={totalWords} learnedWords={learnedWords} />
        </View>

        {/* Título de sección */}
        <View style={{ paddingHorizontal: PADDING, marginBottom: 12 }}>
          <Text
            style={{
              fontFamily: "NotoSansJP_700Bold",
              fontSize: 16,
              color: "#374151",
            }}
          >
            カテゴリー
          </Text>
        </View>

        {/* Grid de categorías */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: PADDING,
            gap: GAP,
          }}
        >
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </View>

        {/* Mensaje si no hay resultados */}
        {filteredCategories.length === 0 && searchQuery.trim() && (
          <View style={{ padding: PADDING, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 14,
                color: "#9CA3AF",
                textAlign: "center",
              }}
            >
              「{searchQuery}」の結果はありません
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
