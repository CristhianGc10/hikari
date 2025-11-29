// app/modules/vocab/practice/[category].tsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Dimensions, Pressable, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Volume2, 
  Check, 
  X as XIcon,
  Shuffle,
  Eye,
  EyeOff,
} from 'lucide-react-native';

// Importar datos
import { VOCAB_DATA, VocabWord, getCategoryById } from '@/src/data/vocabData';

const { width, height } = Dimensions.get('window');

// Colores
const THEME_COLOR = '#F5A238';
const CORRECT_COLOR = '#22C55E';
const INCORRECT_COLOR = '#EF4444';

// Colores por categoría
const CATEGORY_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  people: { bg: '#FFF0F5', text: '#DB2777', accent: '#EC4899' },
  food: { bg: '#FEF3E2', text: '#EA580C', accent: '#F97316' },
  clothes: { bg: '#F0F9FF', text: '#0369A1', accent: '#0EA5E9' },
  house: { bg: '#F5F3FF', text: '#7C3AED', accent: '#8B5CF6' },
  vehicle: { bg: '#ECFDF5', text: '#059669', accent: '#10B981' },
  tools: { bg: '#FEF9C3', text: '#CA8A04', accent: '#EAB308' },
  date: { bg: '#FCE7F3', text: '#BE185D', accent: '#EC4899' },
  time: { bg: '#E0E7FF', text: '#4338CA', accent: '#6366F1' },
  location: { bg: '#CCFBF1', text: '#0D9488', accent: '#14B8A6' },
  facility: { bg: '#FEE2E2', text: '#DC2626', accent: '#EF4444' },
  body: { bg: '#FFE4E6', text: '#E11D48', accent: '#F43F5E' },
  nature: { bg: '#D1FAE5', text: '#047857', accent: '#10B981' },
  condition: { bg: '#E0F2FE', text: '#0284C7', accent: '#0EA5E9' },
  work: { bg: '#F3E8FF', text: '#9333EA', accent: '#A855F7' },
  numbers: { bg: '#FDF4FF', text: '#A21CAF', accent: '#D946EF' },
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
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Icon size={size * 0.45} color={color} strokeWidth={2.5} />
      </Animated.View>
    </Pressable>
  );
};

// Componente de Flashcard
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
      toValue: isFlipped ? 180 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [isFlipped]);

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

  // Interpolaciones para la rotación
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [0, 0, 1],
  });

  return (
    <Pressable onPress={onFlip} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={{ width: width - PADDING * 2, height: CARD_HEIGHT }}>
          {/* Frente de la tarjeta (Japonés) */}
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            }}
          >
            <Surface
              style={{
                flex: 1,
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
                borderWidth: 2,
                borderColor: colors.accent,
              }}
              elevation={2}
            >
              {/* Kanji/Palabra */}
              <Text
                style={{
                  fontFamily: 'NotoSansJP_700Bold',
                  fontSize: 64,
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                {word.japanese}
              </Text>

              {/* Lectura (si es diferente) */}
              {word.reading && word.reading !== word.japanese && (
                <Text
                  style={{
                    fontFamily: 'NotoSansJP_400Regular',
                    fontSize: 24,
                    color: '#9CA3AF',
                    marginTop: 12,
                  }}
                >
                  {word.reading}
                </Text>
              )}

              {/* Indicador de tocar */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: 0.5,
                }}
              >
                <RotateCcw size={16} color="#9CA3AF" />
                <Text
                  style={{
                    fontFamily: 'NotoSansJP_400Regular',
                    fontSize: 12,
                    color: '#9CA3AF',
                    marginLeft: 6,
                  }}
                >
                  Toca para ver significado
                </Text>
              </View>
            </Surface>
          </Animated.View>

          {/* Reverso de la tarjeta (Significado) */}
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
            }}
          >
            <Surface
              style={{
                flex: 1,
                borderRadius: 24,
                backgroundColor: colors.bg,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
                borderWidth: 2,
                borderColor: colors.accent,
              }}
              elevation={2}
            >
              {/* Significado */}
              <Text
                style={{
                  fontFamily: 'NotoSansJP_700Bold',
                  fontSize: 32,
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                {word.meaning}
              </Text>

              {/* Palabra japonesa (pequeña) */}
              <Text
                style={{
                  fontFamily: 'NotoSansJP_400Regular',
                  fontSize: 18,
                  color: colors.text,
                  opacity: 0.7,
                  marginTop: 12,
                }}
              >
                {word.japanese} ({word.reading})
              </Text>

              {/* Ejemplo (si existe) */}
              {word.example && (
                <View
                  style={{
                    marginTop: 24,
                    padding: 16,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'NotoSansJP_400Regular',
                      fontSize: 16,
                      color: '#4B5563',
                      textAlign: 'center',
                    }}
                  >
                    {word.example}
                  </Text>
                  {word.exampleMeaning && (
                    <Text
                      style={{
                        fontFamily: 'NotoSansJP_400Regular',
                        fontSize: 14,
                        color: '#9CA3AF',
                        textAlign: 'center',
                        marginTop: 6,
                        fontStyle: 'italic',
                      }}
                    >
                      {word.exampleMeaning}
                    </Text>
                  )}
                </View>
              )}

              {/* Indicador de tocar */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: 0.5,
                }}
              >
                <RotateCcw size={16} color={colors.text} />
                <Text
                  style={{
                    fontFamily: 'NotoSansJP_400Regular',
                    fontSize: 12,
                    color: colors.text,
                    marginLeft: 6,
                  }}
                >
                  Toca para ver palabra
                </Text>
              </View>
            </Surface>
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function PracticeScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const categoryId = typeof category === 'string' ? category : 'people';

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
    setIsFlipped(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, words.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleKnown = useCallback(() => {
    if (currentWord) {
      setKnownWords(prev => new Set(prev).add(currentWord.id));
      unknownWords.delete(currentWord.id);
      handleNext();
    }
  }, [currentWord, handleNext, unknownWords]);

  const handleUnknown = useCallback(() => {
    if (currentWord) {
      setUnknownWords(prev => new Set(prev).add(currentWord.id));
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'NotoSansJP_400Regular', fontSize: 16, color: '#6B7280' }}>
          No hay palabras en esta categoría
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
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
            backgroundColor: '#F3F4F6',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={24} color="#374151" strokeWidth={2} />
        </Pressable>

        {/* Título */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'NotoSansJP_700Bold',
              fontSize: 18,
              color: colors.text,
            }}
          >
            {categoryData?.titleJp || 'Práctica'}
          </Text>
          <Text
            style={{
              fontFamily: 'NotoSansJP_400Regular',
              fontSize: 12,
              color: '#9CA3AF',
            }}
          >
            {currentIndex + 1} / {words.length}
          </Text>
        </View>

        {/* Botón shuffle */}
        <Pressable
          onPress={handleShuffle}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.bg,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Shuffle size={20} color={colors.accent} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Barra de progreso */}
      <View style={{ paddingHorizontal: PADDING, marginBottom: 16 }}>
        <View
          style={{
            height: 6,
            backgroundColor: '#F3F4F6',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor: colors.accent,
              borderRadius: 3,
            }}
          />
        </View>

        {/* Estadísticas */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: CORRECT_COLOR,
                marginRight: 6,
              }}
            />
            <Text style={{ fontFamily: 'NotoSansJP_400Regular', fontSize: 12, color: '#6B7280' }}>
              Conocidas: {knownWords.size}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: INCORRECT_COLOR,
                marginRight: 6,
              }}
            />
            <Text style={{ fontFamily: 'NotoSansJP_400Regular', fontSize: 12, color: '#6B7280' }}>
              Por repasar: {unknownWords.size}
            </Text>
          </View>
        </View>
      </View>

      {/* Flashcard */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: PADDING }}>
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Botón anterior */}
          <ActionButton
            icon={ChevronLeft}
            color={currentIndex > 0 ? '#374151' : '#D1D5DB'}
            bgColor="#F3F4F6"
            onPress={handlePrevious}
            size={48}
          />

          {/* Botones de conocido/desconocido */}
          <View style={{ flexDirection: 'row', gap: 16 }}>
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
            color={currentIndex < words.length - 1 ? '#374151' : '#D1D5DB'}
            bgColor="#F3F4F6"
            onPress={handleNext}
            size={48}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}