import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { headerEnter, listItemEnter, pressScale, releaseScale } from '@/src/core/animations';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { Shuffle, GraduationCap, Volume2 } from 'lucide-react-native';

// Importar datos de vocabulario
import { VOCAB_DATA, VocabWord, getCategoryById } from '@/src/data/vocabData';

const { width, height } = Dimensions.get('window');

// ============================================================================
// COLORES Y TOKENS
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
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// Altura fija para todas las tarjetas de palabras - Ajustada para mejor espaciado
const WORD_CARD_HEIGHT = 76;

// Colores por categoría
const CATEGORY_COLORS: Record<string, string> = {
    people: '#EC4899',
    food: '#F97316',
    clothes: '#0EA5E9',
    house: '#8B5CF6',
    vehicle: '#10B981',
    tools: '#EAB308',
    date: '#EC4899',
    time: '#6366F1',
    location: '#14B8A6',
    facility: '#EF4444',
    body: '#F43F5E',
    nature: '#10B981',
    condition: '#0EA5E9',
    work: '#A855F7',
    numbers: '#D946EF',
};

// ============================================================================
// COMPONENTES
// ============================================================================

const CategoryHeader = ({
    title,
    subtitle,
    wordCount,
    learnedCount,
    categoryColor,
    onPractice,
    onShuffle,
}: {
    title: string;
    subtitle: string;
    wordCount: number;
    learnedCount: number;
    categoryColor: string;
    onPractice: () => void;
    onShuffle: () => void;
}) => {
    const progress = wordCount > 0 ? learnedCount / wordCount : 0;
    const remaining = wordCount - learnedCount;

    return (
        <Animated.View entering={headerEnter()} style={styles.categoryHeader}>
            <View style={styles.headerContent}>
                {/* Izquierda - Título */}
                <View style={styles.headerLeft}>
                    <Text style={[styles.headerTitle, { color: categoryColor }]}>{title}</Text>
                    <Text style={styles.headerSubtitle}>{subtitle}</Text>

                    {/* Mini barra de progreso */}
                    <View style={styles.headerProgressBar}>
                        <View
                            style={[
                                styles.headerProgressFill,
                                {
                                    width: `${progress * 100}%`,
                                    backgroundColor: categoryColor,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Derecha - Estadísticas */}
                <View style={styles.headerRight}>
                    <Text style={[styles.headerPercentage, { color: categoryColor }]}>
                        {Math.round(progress * 100)}
                        <Text style={styles.headerPercentageSymbol}>%</Text>
                    </Text>

                    <View style={styles.statRow}>
                        <Text style={styles.statText}>{learnedCount}</Text>
                        <Text style={styles.statLabel}>習得</Text>
                    </View>

                    <View style={styles.statRow}>
                        <Text style={[styles.statText, { opacity: 0.5 }]}>{remaining}</Text>
                        <Text style={[styles.statLabel, { opacity: 0.5 }]}>残り</Text>
                    </View>
                </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionButtons}>
                <Pressable
                    onPress={onPractice}
                    style={[styles.practiceButton, { backgroundColor: categoryColor }]}
                >
                    <GraduationCap size={18} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.practiceButtonText}>練習</Text>
                </Pressable>

                <Pressable onPress={onShuffle} style={styles.shuffleButton}>
                    <Shuffle size={20} color={categoryColor} strokeWidth={2.5} />
                </Pressable>
            </View>
        </Animated.View>
    );
};

const WordCard = ({
    word,
    categoryColor,
    onPress,
    index,
}: {
    word: VocabWord;
    categoryColor: string;
    onPress: () => void;
    index: number;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = pressScale(0.98);
    };

    const handlePressOut = () => {
        scale.value = releaseScale();
    };

    return (
        <Animated.View
            entering={listItemEnter(index)}
            style={styles.wordCard}
        >
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                <Pressable
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.wordPressable}
                >
                    <View style={styles.wordCardInner}>
                        {/* Contenido - solo palabra japonesa y lectura */}
                        <View style={[
                            styles.wordContent,
                            !(word.reading && word.reading !== word.japanese) && styles.wordContentCentered
                        ]}>
                            <Text style={[styles.wordJapanese, { color: categoryColor }]} numberOfLines={1}>
                                {word.japanese}
                            </Text>
                            {word.reading && word.reading !== word.japanese && (
                                <Text style={styles.wordReading} numberOfLines={1}>
                                    {word.reading}
                                </Text>
                            )}
                        </View>

                        {/* Botón de audio */}
                        <Pressable style={styles.audioButton}>
                            <Volume2 size={16} color={categoryColor} strokeWidth={2.5} />
                        </Pressable>
                    </View>
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

// ============================================================================
// PANTALLA PRINCIPAL
// ============================================================================

export default function CategoryScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const categoryId = typeof id === 'string' ? id : 'people';

    // Obtener datos
    const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
    const words = useMemo(() => VOCAB_DATA[categoryId] || [], [categoryId]);
    const categoryColor = CATEGORY_COLORS[categoryId] || CATEGORY_COLORS.people;

    const learnedWords = 0; // TODO: Conectar con sistema de progreso

    const handleWordPress = (word: VocabWord) => {
        router.push(`/modules/vocab/word/${word.id}` as any);
    };

    const handlePractice = () => {
        router.push(`/modules/vocab/practice/${categoryId}` as any);
    };

    const handleShuffle = () => {
        router.push(`/modules/vocab/practice/${categoryId}?shuffle=true` as any);
    };

    if (!category) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>カテゴリーが見つかりません</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header de categoría */}
                <CategoryHeader
                    title={category.titleJp}
                    subtitle={category.titleEs}
                    wordCount={words.length}
                    learnedCount={learnedWords}
                    categoryColor={categoryColor}
                    onPractice={handlePractice}
                    onShuffle={handleShuffle}
                />

                {/* Contador de palabras */}
                <View style={styles.wordCountSection}>
                    <Text style={styles.wordCountText}>{words.length}語</Text>
                </View>

                {/* Lista de palabras - ALTURA UNIFORME */}
                <View style={styles.wordsContainer}>
                    {words.map((word, index) => (
                        <WordCard
                            key={word.id}
                            word={word}
                            categoryColor={categoryColor}
                            onPress={() => handleWordPress(word)}
                            index={index}
                        />
                    ))}
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingHorizontal: spacing.screen,
        paddingBottom: spacing.xxl,
    },
    errorText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 14,
        color: colors.text.secondary,
    },

    // Category Header
    categoryHeader: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        overflow: 'hidden',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        minHeight: 120,
        padding: spacing.xl,
        gap: spacing.xl,
    },
    headerLeft: {
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 32,
        includeFontPadding: false,
    },
    headerSubtitle: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 14,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    headerProgressBar: {
        marginTop: spacing.md,
        height: 4,
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    headerProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    headerRight: {
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerPercentage: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 36,
        includeFontPadding: false,
        lineHeight: 40,
    },
    headerPercentageSymbol: {
        fontSize: 18,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: spacing.xs,
    },
    statText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 13,
        color: colors.text.secondary,
    },
    statLabel: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 11,
        color: colors.text.secondary,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        gap: spacing.sm,
    },
    practiceButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 46,
        borderRadius: radius.sm,
        gap: spacing.sm,
    },
    practiceButtonText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 15,
        color: '#FFFFFF',
    },
    shuffleButton: {
        width: 46,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: radius.sm,
    },

    // Word Count Section
    wordCountSection: {
        marginBottom: spacing.lg,
    },
    wordCountText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 12,
        color: colors.text.tertiary,
    },

    // Words Container
    wordsContainer: {
        gap: spacing.sm,
    },
    wordCard: {
        width: '100%',
        height: WORD_CARD_HEIGHT, // ALTURA FIJA
    },
    wordPressable: {
        flex: 1,
    },
    wordCardInner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    wordContent: {
        flex: 1,
        justifyContent: 'center',
        gap: 2,
        paddingVertical: 2,
    },
    wordContentCentered: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    wordJapanese: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 19,
        includeFontPadding: false,
        lineHeight: 24,
    },
    wordReading: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.tertiary,
        includeFontPadding: false,
        lineHeight: 16,
    },
    audioButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.md,
    },
});
