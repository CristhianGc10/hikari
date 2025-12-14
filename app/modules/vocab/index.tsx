import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { staggeredCardEnter, headerEnter, pressScale, releaseScale } from '@/src/core/animations';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import {
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
    Clock,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// ============================================================================
// COLORES Y TOKENS - Consistente con homescreen
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
    levels: {
        n5: { primary: '#F0A55A', light: 'rgba(240, 165, 90, 0.12)' },
    },
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// Colores específicos por categoría
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

// Iconos por categoría
const CATEGORY_ICONS: Record<string, any> = {
    people: Users,
    food: Utensils,
    clothes: Shirt,
    house: Home,
    vehicle: Car,
    tools: Wrench,
    date: Calendar,
    time: Clock,
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
    title: string;
    subtitle: string;
    detail: string;
    progress: number;
    icon: keyof typeof CATEGORY_ICONS;
};

// Categorías del vocabulario N5 - solo japonés
const CATEGORIES: VocabCategory[] = [
    { id: 'people', title: '人', subtitle: '人物', detail: '43語', progress: 0.35, icon: 'people' },
    { id: 'food', title: '食べ物', subtitle: '食品', detail: '41語', progress: 0.12, icon: 'food' },
    { id: 'clothes', title: '服', subtitle: '衣類', detail: '16語', progress: 0, icon: 'clothes' },
    { id: 'house', title: '家', subtitle: '住居', detail: '17語', progress: 0, icon: 'house' },
    { id: 'vehicle', title: '乗り物', subtitle: '交通', detail: '11語', progress: 0.55, icon: 'vehicle' },
    { id: 'tools', title: '道具', subtitle: '用具', detail: '22語', progress: 0, icon: 'tools' },
    { id: 'date', title: '日付', subtitle: '暦', detail: '30語', progress: 0, icon: 'date' },
    { id: 'time', title: '時間', subtitle: '時刻', detail: '29語', progress: 0.28, icon: 'time' },
    { id: 'location', title: '位置', subtitle: '場所', detail: '20語', progress: 0, icon: 'location' },
    { id: 'facility', title: '施設', subtitle: '建物', detail: '31語', progress: 0, icon: 'facility' },
    { id: 'body', title: '体', subtitle: '身体', detail: '17語', progress: 0, icon: 'body' },
    { id: 'nature', title: '自然', subtitle: '環境', detail: '18語', progress: 0, icon: 'nature' },
    { id: 'condition', title: '状態', subtitle: '様子', detail: '22語', progress: 0, icon: 'condition' },
    { id: 'work', title: '仕事', subtitle: '職業', detail: '38語', progress: 0, icon: 'work' },
    { id: 'numbers', title: '数字', subtitle: '数', detail: '80語', progress: 0, icon: 'numbers' },
];

// ============================================================================
// COMPONENTES
// ============================================================================

const CategoryCard = ({
    category,
    index,
    onPress,
}: {
    category: VocabCategory;
    index: number;
    onPress: () => void;
}) => {
    const categoryColor = CATEGORY_COLORS[category.id] || CATEGORY_COLORS.people;
    const IconComponent = CATEGORY_ICONS[category.icon] || Users;
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = pressScale(0.96);
    };

    const handlePressOut = () => {
        scale.value = releaseScale();
    };

    return (
        <Animated.View
            entering={staggeredCardEnter(index, 100, 50)}
            style={styles.categoryWrapper}
        >
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.categoryWrapper}
            >
                <Animated.View style={[styles.categoryCard, { backgroundColor: colors.surface }, animatedStyle]}>
                    {/* Parte superior - Icono + Detalle */}
                    <View style={styles.cardTop}>
                        <IconComponent size={32} color={categoryColor} strokeWidth={2.2} />
                        <Text style={[styles.detailText, { color: categoryColor }]}>{category.detail}</Text>
                    </View>

                    {/* Parte inferior - Textos + Progreso */}
                    <View style={styles.cardBottom}>
                        <View style={styles.textGroup}>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <Text style={styles.categorySubtitle} numberOfLines={1}>
                                {category.subtitle}
                            </Text>
                        </View>

                        {/* Barra de progreso - SIEMPRE VISIBLE */}
                        <View style={styles.progressContainer}>
                            <View
                                style={[
                                    styles.progressTrack,
                                    { backgroundColor: `${categoryColor}20` },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${category.progress * 100}%`,
                                            backgroundColor: categoryColor,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={[styles.progressText, { color: categoryColor }]}>
                                {Math.round(category.progress * 100)}%
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

// ============================================================================
// PANTALLA PRINCIPAL
// ============================================================================

export default function VocabScreen() {
    const router = useRouter();

    const handleCategoryPress = (categoryId: string) => {
        router.push(`/modules/vocab/category/${categoryId}` as any);
    };

    // Cálculo de tamaños más grandes para las tarjetas
    const headerHeight = 100;
    const safeAreaTop = 50;
    const bottomPadding = 20;
    const availableHeight = height - headerHeight - safeAreaTop - bottomPadding;

    // 3 filas con más espacio entre ellas
    const cardHeight = (availableHeight - spacing.md * 4) / 3;
    const cardWidth = (width - spacing.screen * 2 - spacing.md) / 2;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                {/* Header - estilo consistente con levels */}
                <Animated.View entering={headerEnter()} style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.levelBadge, { backgroundColor: colors.levels.n5.light }]}>
                            <Text style={[styles.levelBadgeText, { color: colors.levels.n5.primary }]}>
                                N5
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.levelName}>語彙</Text>
                            <Text style={styles.levelSubtitle}>基本単語</Text>
                        </View>
                    </View>
                    <Text style={[styles.levelKanji, { color: colors.levels.n5.primary }]}>語</Text>
                </Animated.View>

                {/* Grid de categorías - scroll vertical */}
                <ScrollView
                    contentContainerStyle={styles.categoriesContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Filas de 2 columnas */}
                    {Array.from({ length: Math.ceil(CATEGORIES.length / 2) }).map((_, rowIndex) => (
                        <View key={rowIndex} style={styles.categoryRow}>
                            {CATEGORIES.slice(rowIndex * 2, rowIndex * 2 + 2).map((category, colIndex) => (
                                <View
                                    key={category.id}
                                    style={{ width: cardWidth, height: cardHeight }}
                                >
                                    <CategoryCard
                                        category={category}
                                        index={rowIndex * 2 + colIndex}
                                        onPress={() => handleCategoryPress(category.id)}
                                    />
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
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
    content: {
        flex: 1,
        paddingHorizontal: spacing.screen,
    },

    // Header - igual que levels/[id].tsx
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        flex: 1,
    },
    levelBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.sm,
    },
    levelBadgeText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 12,
        includeFontPadding: false,
        letterSpacing: 0.8,
    },
    titleContainer: {
        flex: 1,
    },
    levelName: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 28,
        color: colors.text.primary,
        includeFontPadding: false,
        letterSpacing: -0.5,
        lineHeight: 34,
    },
    levelSubtitle: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 14,
        color: colors.text.secondary,
        includeFontPadding: false,
        marginTop: 2,
    },
    levelKanji: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 52,
        includeFontPadding: false,
        lineHeight: 52,
        marginLeft: spacing.md,
    },

    // Grid de categorías
    categoriesContainer: {
        gap: spacing.md,
        paddingBottom: spacing.xl,
    },
    categoryRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },

    // Tarjetas - más grandes que antes
    categoryWrapper: {
        flex: 1,
    },
    categoryCard: {
        flex: 1,
        borderRadius: radius.lg,
        padding: spacing.xl,
        justifyContent: 'space-between',
    },

    // Parte superior (icono + detalle)
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    // Parte inferior (textos + progreso)
    cardBottom: {
        gap: spacing.md,
    },
    textGroup: {
        gap: 4,
    },
    categoryTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 22,
        color: colors.text.primary,
        includeFontPadding: false,
        letterSpacing: -0.2,
        lineHeight: 28,
    },
    categorySubtitle: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 13,
        color: colors.text.secondary,
        includeFontPadding: false,
        lineHeight: 18,
        opacity: 0.8,
    },

    // Texto de detalle
    detailText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 12,
        includeFontPadding: false,
        letterSpacing: 0.3,
        opacity: 0.7,
    },

    // Progreso - SIEMPRE VISIBLE
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    progressTrack: {
        flex: 1,
        height: 5,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 11,
        includeFontPadding: false,
        letterSpacing: 0.3,
        opacity: 0.8,
        minWidth: 32,
        textAlign: 'right',
    },
});
