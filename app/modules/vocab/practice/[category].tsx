import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Dimensions, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, Check, X as XIcon } from 'lucide-react-native';
import { pressScale, releaseScale, springConfig, materialEasing, materialDuration } from '@/src/core/animations';

// Importar datos
import { VOCAB_DATA, VocabWord, getCategoryById } from '@/src/data/vocabData';

const { width, height } = Dimensions.get('window');

// ============================================================================
// COLORES Y TOKENS - Tema oscuro consistente
// ============================================================================

const colors = {
    bg: '#151621',
    surface: '#1E2030',
    surfaceLight: '#262940',
    text: {
        primary: '#FFFFFF',
        secondary: '#8F92A8',
        tertiary: '#5D6080',
    },
    correct: '#10B981',
    incorrect: '#EF4444',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// Colores por categoría
const CATEGORY_COLORS: Record<string, { primary: string; light: string }> = {
    people: { primary: '#EC4899', light: 'rgba(236, 72, 153, 0.12)' },
    food: { primary: '#F97316', light: 'rgba(249, 115, 22, 0.12)' },
    clothes: { primary: '#0EA5E9', light: 'rgba(14, 165, 233, 0.12)' },
    house: { primary: '#8B5CF6', light: 'rgba(139, 92, 246, 0.12)' },
    vehicle: { primary: '#10B981', light: 'rgba(16, 185, 129, 0.12)' },
    tools: { primary: '#EAB308', light: 'rgba(234, 179, 8, 0.12)' },
    date: { primary: '#EC4899', light: 'rgba(236, 72, 153, 0.12)' },
    time: { primary: '#6366F1', light: 'rgba(99, 102, 241, 0.12)' },
    location: { primary: '#14B8A6', light: 'rgba(20, 184, 166, 0.12)' },
    facility: { primary: '#EF4444', light: 'rgba(239, 68, 68, 0.12)' },
    body: { primary: '#F43F5E', light: 'rgba(244, 63, 94, 0.12)' },
    nature: { primary: '#10B981', light: 'rgba(16, 185, 129, 0.12)' },
    condition: { primary: '#0EA5E9', light: 'rgba(14, 165, 233, 0.12)' },
    work: { primary: '#A855F7', light: 'rgba(168, 85, 247, 0.12)' },
    numbers: { primary: '#D946EF', light: 'rgba(217, 70, 239, 0.12)' },
};

const CARD_HEIGHT = height * 0.5;

// ============================================================================
// COMPONENTES
// ============================================================================

// Componente de botón de acción - Container Transform
const ActionButton = ({
    icon: Icon,
    color,
    bgColor,
    onPress,
    size = 48,
    disabled = false,
}: {
    icon: any;
    color: string;
    bgColor: string;
    onPress: () => void;
    size?: number;
    disabled?: boolean;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (!disabled) {
            scale.value = pressScale(0.9);
        }
    };

    const handlePressOut = () => {
        scale.value = releaseScale();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: disabled ? colors.surfaceLight : bgColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: disabled ? 0.3 : 1,
                    },
                    animatedStyle,
                ]}
            >
                <Icon size={size * 0.45} color={color} strokeWidth={2.5} />
            </Animated.View>
        </Pressable>
    );
};

// Componente de Flashcard - Container Transform
const Flashcard = ({
    word,
    isFlipped,
    onFlip,
    categoryColor,
}: {
    word: VocabWord;
    isFlipped: boolean;
    onFlip: () => void;
    categoryColor: { primary: string; light: string };
}) => {
    const flipProgress = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        flipProgress.value = withSpring(isFlipped ? 1 : 0, {
            ...springConfig.smooth,
            damping: 11,
            stiffness: 65,
        });
    }, [isFlipped]);

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
        const opacity = interpolate(flipProgress.value, [0, 0.5, 1], [1, 0, 0]);
        return {
            transform: [{ rotateY: `${rotateY}deg` }],
            opacity,
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
        const opacity = interpolate(flipProgress.value, [0, 0.5, 1], [0, 0, 1]);
        return {
            transform: [{ rotateY: `${rotateY}deg` }],
            opacity,
        };
    });

    const handlePressIn = () => {
        scale.value = pressScale(0.97);
    };

    const handlePressOut = () => {
        scale.value = releaseScale();
    };

    const cardWidth = width - spacing.screen * 2;

    return (
        <Pressable onPress={onFlip} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View
                style={[
                    {
                        width: cardWidth,
                        height: CARD_HEIGHT,
                    },
                    animatedCardStyle,
                ]}
            >
                {/* Cara frontal - Palabra japonesa */}
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                        },
                        frontAnimatedStyle,
                    ]}
                >
                    <View style={[styles.flashcardFront, { backgroundColor: categoryColor.light }]}>
                        {/* Decoración de fondo */}
                        <View
                            style={[
                                styles.decorationCircle,
                                {
                                    backgroundColor: categoryColor.primary,
                                    opacity: 0.08,
                                    width: 180,
                                    height: 180,
                                    right: -40,
                                    top: -40,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.decorationCircle,
                                {
                                    backgroundColor: categoryColor.primary,
                                    opacity: 0.05,
                                    width: 120,
                                    height: 120,
                                    left: -30,
                                    bottom: -30,
                                },
                            ]}
                        />

                        {/* Contenido centrado */}
                        <View style={styles.flashcardContent}>
                            {/* Palabra japonesa */}
                            <Text
                                style={[styles.japaneseText, { color: categoryColor.primary }]}
                                numberOfLines={2}
                                adjustsFontSizeToFit
                            >
                                {word.japanese}
                            </Text>

                            {/* Lectura */}
                            {word.reading && word.reading !== word.japanese && (
                                <Text style={[styles.readingText, { color: categoryColor.primary }]}>
                                    {word.reading}
                                </Text>
                            )}

                            {/* Botón de audio - CONSERVADO del diseño original */}
                            <Pressable style={[styles.audioButton, { backgroundColor: categoryColor.primary }]}>
                                <Volume2 size={20} color="#FFFFFF" strokeWidth={2.5} />
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>

                {/* Cara trasera - Significado */}
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                        },
                        backAnimatedStyle,
                    ]}
                >
                    <View style={[styles.flashcardBack, { backgroundColor: colors.surface }]}>
                        <View style={styles.flashcardContent}>
                            {/* Significado */}
                            <Text
                                style={[styles.meaningText, { color: categoryColor.primary }]}
                                numberOfLines={3}
                                adjustsFontSizeToFit
                            >
                                {word.meaning}
                            </Text>

                            {/* Palabra japonesa pequeña */}
                            <View style={styles.backJapaneseSection}>
                                <Text style={styles.backJapaneseText}>{word.japanese}</Text>
                                {word.reading && word.reading !== word.japanese && (
                                    <Text style={styles.backReadingText}>{word.reading}</Text>
                                )}
                            </View>

                            {/* Ejemplo */}
                            {word.example && (
                                <View style={styles.exampleSection}>
                                    <Text style={styles.exampleText} numberOfLines={2}>
                                        {word.example}
                                    </Text>
                                    {word.exampleMeaning && (
                                        <Text style={styles.exampleMeaningText} numberOfLines={2}>
                                            {word.exampleMeaning}
                                        </Text>
                                    )}
                                </View>
                            )}

                            {/* Botón de audio - CONSERVADO */}
                            <Pressable style={[styles.audioButton, { backgroundColor: categoryColor.primary }]}>
                                <Volume2 size={20} color="#FFFFFF" strokeWidth={2.5} />
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </Pressable>
    );
};

// ============================================================================
// PANTALLA PRINCIPAL
// ============================================================================

export default function PracticeScreen() {
    const { category } = useLocalSearchParams();
    const router = useRouter();
    const categoryId = typeof category === 'string' ? category : 'people';

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [words, setWords] = useState<VocabWord[]>([]);
    const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
    const [unknownWords, setUnknownWords] = useState<Set<string>>(new Set());

    // Obtener datos
    const categoryData = useMemo(() => getCategoryById(categoryId), [categoryId]);
    const categoryColor = CATEGORY_COLORS[categoryId] || CATEGORY_COLORS.people;

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

    if (!currentWord || words.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>No hay palabras en esta categoría</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header simplificado */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerTitles}>
                        <Text style={[styles.headerTitle, { color: categoryColor.primary }]}>
                            {categoryData?.titleJp || '練習'}
                        </Text>
                        <Text style={styles.headerCounter}>
                            {currentIndex + 1} / {words.length}
                        </Text>
                    </View>
                    <Pressable onPress={handleShuffle} style={styles.shuffleButton}>
                        <RotateCcw size={18} color={categoryColor.primary} strokeWidth={2.5} />
                    </Pressable>
                </View>

                {/* Barra de progreso */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progress * 100}%`,
                                    backgroundColor: categoryColor.primary,
                                },
                            ]}
                        />
                    </View>

                    {/* Estadísticas */}
                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <View style={[styles.statDot, { backgroundColor: colors.correct }]} />
                            <Text style={styles.statText}>{knownWords.size} Conocidas</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statDot, { backgroundColor: colors.incorrect }]} />
                            <Text style={styles.statText}>{unknownWords.size} Por repasar</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Flashcard */}
            <View style={styles.flashcardContainer}>
                <Flashcard
                    word={currentWord}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    categoryColor={categoryColor}
                />
            </View>

            {/* Controles */}
            <View style={styles.controls}>
                <View style={styles.controlsRow}>
                    {/* Botón anterior */}
                    <ActionButton
                        icon={ChevronLeft}
                        color={colors.text.secondary}
                        bgColor={colors.surface}
                        onPress={handlePrevious}
                        size={48}
                        disabled={currentIndex === 0}
                    />

                    {/* Botones de conocido/desconocido */}
                    <View style={styles.actionButtonsGroup}>
                        <ActionButton
                            icon={XIcon}
                            color="#FFFFFF"
                            bgColor={colors.incorrect}
                            onPress={handleUnknown}
                            size={64}
                        />
                        <ActionButton
                            icon={Check}
                            color="#FFFFFF"
                            bgColor={colors.correct}
                            onPress={handleKnown}
                            size={64}
                        />
                    </View>

                    {/* Botón siguiente */}
                    <ActionButton
                        icon={ChevronRight}
                        color={colors.text.secondary}
                        bgColor={colors.surface}
                        onPress={handleNext}
                        size={48}
                        disabled={currentIndex >= words.length - 1}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 16,
        color: colors.text.secondary,
    },

    // Header
    header: {
        paddingHorizontal: spacing.screen,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    headerTitles: {
        flex: 1,
    },
    headerTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 20,
        includeFontPadding: false,
    },
    headerCounter: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 13,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
    shuffleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarContainer: {
        gap: spacing.md,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.surface,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    statDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.secondary,
    },

    // Flashcard
    flashcardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.screen,
    },
    flashcardFront: {
        flex: 1,
        borderRadius: radius.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    flashcardBack: {
        flex: 1,
        borderRadius: radius.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    decorationCircle: {
        position: 'absolute',
        borderRadius: 9999,
    },
    flashcardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xxl,
        position: 'relative',
    },
    japaneseText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 52,
        textAlign: 'center',
        includeFontPadding: false,
    },
    readingText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 20,
        marginTop: spacing.md,
        textAlign: 'center',
        opacity: 0.8,
    },
    meaningText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 28,
        textAlign: 'center',
        includeFontPadding: false,
    },
    backJapaneseSection: {
        marginTop: spacing.xl,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    backJapaneseText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 18,
        color: colors.text.secondary,
    },
    backReadingText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 14,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
    exampleSection: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surfaceLight,
        borderRadius: radius.sm,
        width: '100%',
    },
    exampleText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 14,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    exampleMeaningText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    audioButton: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    // Controls
    controls: {
        paddingHorizontal: spacing.screen,
        paddingBottom: spacing.xxl,
        paddingTop: spacing.lg,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionButtonsGroup: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
});
