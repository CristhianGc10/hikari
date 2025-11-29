// app/modules/vocab/index.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, Dimensions, Animated, Pressable, FlatList } from 'react-native';
import { Text, Surface, TouchableRipple, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, Users, Utensils, Shirt, Home, Car, Wrench, Calendar, MapPin, Building2, Heart, Leaf, Sparkles, Briefcase, Hash, Search, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Color base del módulo (N5)
const THEME_COLOR = '#F5A238';
const THEME_LIGHT = '#FEF7ED';

// Colores por categoría - Paleta vibrante y armónica
const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  people: { bg: '#FFF0F5', text: '#DB2777', icon: '#EC4899' },
  food: { bg: '#FEF3E2', text: '#EA580C', icon: '#F97316' },
  clothes: { bg: '#F0F9FF', text: '#0369A1', icon: '#0EA5E9' },
  house: { bg: '#F5F3FF', text: '#7C3AED', icon: '#8B5CF6' },
  vehicle: { bg: '#ECFDF5', text: '#059669', icon: '#10B981' },
  tools: { bg: '#FEF9C3', text: '#CA8A04', icon: '#EAB308' },
  date: { bg: '#FCE7F3', text: '#BE185D', icon: '#EC4899' },
  time: { bg: '#E0E7FF', text: '#4338CA', icon: '#6366F1' },
  location: { bg: '#CCFBF1', text: '#0D9488', icon: '#14B8A6' },
  facility: { bg: '#FEE2E2', text: '#DC2626', icon: '#EF4444' },
  body: { bg: '#FFE4E6', text: '#E11D48', icon: '#F43F5E' },
  nature: { bg: '#D1FAE5', text: '#047857', icon: '#10B981' },
  condition: { bg: '#E0F2FE', text: '#0284C7', icon: '#0EA5E9' },
  work: { bg: '#F3E8FF', text: '#9333EA', icon: '#A855F7' },
  numbers: { bg: '#FDF4FF', text: '#A21CAF', icon: '#D946EF' },
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

type VocabWord = {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
  example?: string;
  exampleMeaning?: string;
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
  { id: 'people', titleJp: '人', titleEs: 'Personas', icon: 'people', wordCount: 43, progress: 0 },
  { id: 'food', titleJp: '食べ物', titleEs: 'Comida', icon: 'food', wordCount: 41, progress: 0 },
  { id: 'clothes', titleJp: '服', titleEs: 'Ropa', icon: 'clothes', wordCount: 16, progress: 0 },
  { id: 'house', titleJp: '家', titleEs: 'Casa', icon: 'house', wordCount: 17, progress: 0 },
  { id: 'vehicle', titleJp: '乗り物', titleEs: 'Transporte', icon: 'vehicle', wordCount: 11, progress: 0 },
  { id: 'tools', titleJp: '道具', titleEs: 'Herramientas', icon: 'tools', wordCount: 22, progress: 0 },
  { id: 'date', titleJp: '日付', titleEs: 'Fechas', icon: 'date', wordCount: 30, progress: 0 },
  { id: 'time', titleJp: '時間', titleEs: 'Tiempo', icon: 'time', wordCount: 29, progress: 0 },
  { id: 'location', titleJp: '位置', titleEs: 'Ubicación', icon: 'location', wordCount: 20, progress: 0 },
  { id: 'facility', titleJp: '施設', titleEs: 'Lugares', icon: 'facility', wordCount: 31, progress: 0 },
  { id: 'body', titleJp: '体', titleEs: 'Cuerpo', icon: 'body', wordCount: 17, progress: 0 },
  { id: 'nature', titleJp: '自然', titleEs: 'Naturaleza', icon: 'nature', wordCount: 18, progress: 0 },
  { id: 'condition', titleJp: '状態', titleEs: 'Estados', icon: 'condition', wordCount: 22, progress: 0 },
  { id: 'work', titleJp: '仕事', titleEs: 'Trabajo y Estudio', icon: 'work', wordCount: 38, progress: 0 },
  { id: 'numbers', titleJp: '数字', titleEs: 'Números', icon: 'numbers', wordCount: 80, progress: 0 },
];

// Grid config
const PADDING = 20;
const GAP = 12;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - PADDING * 2 - GAP) / NUM_COLUMNS;

// Componente de tarjeta de categoría
const CategoryCard = ({ 
  category, 
  onPress 
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
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.bg,
      }}
      elevation={0}
    >
      <TouchableRipple
        onPress={onPress}
        rippleColor={`${colors.icon}20`}
        style={{ padding: 16 }}
      >
        <View>
          {/* Icono y título japonés */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: `${colors.icon}20`,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <IconComponent size={20} color={colors.icon} strokeWidth={2} />
            </View>
            <Text
              style={{
                fontFamily: 'NotoSansJP_700Bold',
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
              fontFamily: 'NotoSansJP_400Regular',
              fontSize: 14,
              color: colors.text,
              opacity: 0.8,
              marginBottom: 8,
            }}
          >
            {category.titleEs}
          </Text>

          {/* Contador de palabras */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontFamily: 'NotoSansJP_400Regular',
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
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${category.progress * 100}%`,
                  height: '100%',
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
const StatsHeader = ({ totalWords, learnedWords }: { totalWords: number; learnedWords: number }) => {
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Icono y título */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: THEME_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <BookOpen size={24} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'NotoSansJP_700Bold',
                fontSize: 18,
                color: '#1F2937',
              }}
            >
              語彙 N5
            </Text>
            <Text
              style={{
                fontFamily: 'NotoSansJP_400Regular',
                fontSize: 13,
                color: '#6B7280',
              }}
            >
              {learnedWords} / {totalWords} palabras
            </Text>
          </View>
        </View>

        {/* Progreso circular */}
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'NotoSansJP_700Bold',
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
          backgroundColor: '#E5E7EB',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${progress * 100}%`,
            height: '100%',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Animación para la barra de búsqueda
  const searchAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(searchAnim, {
      toValue: isSearchActive ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 12,
    }).start();
  }, [isSearchActive]);

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/modules/vocab/category/${categoryId}` as any);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/modules/vocab/search?q=${encodeURIComponent(searchQuery)}` as any);
    }
  };

  // Total de palabras
  const totalWords = CATEGORIES.reduce((sum, cat) => sum + cat.wordCount, 0);
  const learnedWords = 0; // TODO: Conectar con el sistema de progreso

  // Filtrar categorías si hay búsqueda
  const filteredCategories = searchQuery.trim()
    ? CATEGORIES.filter(
        cat =>
          cat.titleJp.includes(searchQuery) ||
          cat.titleEs.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CATEGORIES;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header con título */}
      <View style={{ paddingHorizontal: PADDING, paddingTop: 10, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'NotoSansJP_700Bold',
                fontSize: 24,
                color: THEME_COLOR,
              }}
            >
              語彙
            </Text>
            <Text
              style={{
                fontFamily: 'NotoSansJP_400Regular',
                fontSize: 16,
                color: '#6B7280',
                marginLeft: 8,
              }}
            >
              Vocabulario
            </Text>
          </View>
          
          {/* Botón de búsqueda */}
          <Pressable
            onPress={() => setIsSearchActive(!isSearchActive)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: isSearchActive ? THEME_COLOR : THEME_LIGHT,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isSearchActive ? (
              <X size={20} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Search size={20} color={THEME_COLOR} strokeWidth={2} />
            )}
          </Pressable>
        </View>
      </View>

      {/* Barra de búsqueda animada */}
      <Animated.View
        style={{
          height: searchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 56],
          }),
          opacity: searchAnim,
          overflow: 'hidden',
          paddingHorizontal: PADDING,
        }}
      >
        <Searchbar
          placeholder="Buscar palabra..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: 12,
            elevation: 0,
          }}
          inputStyle={{
            fontFamily: 'NotoSansJP_400Regular',
            fontSize: 14,
          }}
          iconColor="#9CA3AF"
        />
      </Animated.View>

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
              fontFamily: 'NotoSansJP_700Bold',
              fontSize: 16,
              color: '#374151',
            }}
          >
            Categorías
          </Text>
          <Text
            style={{
              fontFamily: 'NotoSansJP_400Regular',
              fontSize: 13,
              color: '#9CA3AF',
              marginTop: 2,
            }}
          >
            {CATEGORIES.length} categorías · {totalWords} palabras en total
          </Text>
        </View>

        {/* Grid de categorías */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: PADDING,
            gap: GAP,
          }}
        >
          {filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </View>

        {/* Mensaje si no hay resultados */}
        {filteredCategories.length === 0 && searchQuery.trim() && (
          <View style={{ padding: PADDING, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'NotoSansJP_400Regular',
                fontSize: 14,
                color: '#9CA3AF',
                textAlign: 'center',
              }}
            >
              No se encontraron categorías para "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}