// app/achievements/index.tsx
import React from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Trophy, Star, Target, Zap, Award, BookOpen, Calendar, Flame } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { headerEnter, staggeredCardEnter } from '@/src/core/animations';
import { FloatingNavBar } from '@/src/components/navigation/FloatingNavBar';

const { width } = Dimensions.get('window');

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
    gold: '#F0A55A',
    silver: '#8F92A8',
    bronze: '#CD7F32',
    locked: '#3A3D52',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// ============================================================================
// DATOS DE LOGROS
// ============================================================================

type Achievement = {
    id: string;
    title: string;
    description: string;
    icon: any;
    unlocked: boolean;
    progress?: number;
    total?: number;
    tier: 'gold' | 'silver' | 'bronze';
};

const ACHIEVEMENTS: Achievement[] = [
    {
        id: '1',
        title: '最初の一歩',
        description: '初めてのレッスンを完了',
        icon: Star,
        unlocked: true,
        tier: 'bronze',
    },
    {
        id: '2',
        title: '継続は力なり',
        description: '7日連続で学習',
        icon: Flame,
        unlocked: true,
        tier: 'silver',
    },
    {
        id: '3',
        title: '仮名マスター',
        description: 'ひらがなとカタカナを習得',
        icon: BookOpen,
        unlocked: false,
        progress: 68,
        total: 100,
        tier: 'gold',
    },
    {
        id: '4',
        title: '語彙の達人',
        description: '500単語を学習',
        icon: Target,
        unlocked: false,
        progress: 156,
        total: 500,
        tier: 'gold',
    },
    {
        id: '5',
        title: '週間チャンピオン',
        description: '週7日すべて学習',
        icon: Calendar,
        unlocked: false,
        progress: 5,
        total: 7,
        tier: 'silver',
    },
    {
        id: '6',
        title: 'スピードラーナー',
        description: '1日に50問正解',
        icon: Zap,
        unlocked: false,
        progress: 0,
        total: 50,
        tier: 'bronze',
    },
];

// ============================================================================
// COMPONENTES
// ============================================================================

const AchievementCard = ({
    achievement,
    index,
}: {
    achievement: Achievement;
    index: number;
}) => {
    const getTierColor = () => {
        switch (achievement.tier) {
            case 'gold':
                return colors.gold;
            case 'silver':
                return colors.silver;
            case 'bronze':
                return colors.bronze;
        }
    };

    const tierColor = getTierColor();
    const Icon = achievement.icon;
    const isLocked = !achievement.unlocked;

    return (
        <Animated.View
            entering={staggeredCardEnter(index, 80, 50)}
            style={[
                styles.achievementCard,
                {
                    backgroundColor: isLocked ? colors.surfaceLight : colors.surface,
                    opacity: isLocked ? 0.6 : 1,
                },
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: isLocked ? colors.locked : `${tierColor}20`,
                    },
                ]}
            >
                <Icon
                    size={24}
                    color={isLocked ? colors.text.tertiary : tierColor}
                    strokeWidth={2.5}
                />
            </View>

            <View style={styles.achievementContent}>
                <Text
                    style={[
                        styles.achievementTitle,
                        { color: isLocked ? colors.text.tertiary : colors.text.primary },
                    ]}
                >
                    {achievement.title}
                </Text>
                <Text
                    style={[
                        styles.achievementDescription,
                        { color: isLocked ? colors.text.tertiary : colors.text.secondary },
                    ]}
                >
                    {achievement.description}
                </Text>

                {/* Barra de progreso */}
                {!achievement.unlocked && achievement.progress !== undefined && (
                    <View style={styles.progressSection}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${(achievement.progress / (achievement.total || 100)) * 100}%`,
                                        backgroundColor: tierColor,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {achievement.progress} / {achievement.total}
                        </Text>
                    </View>
                )}
            </View>

            {achievement.unlocked && (
                <View style={[styles.badge, { backgroundColor: tierColor }]}>
                    <Trophy size={16} color="#FFFFFF" strokeWidth={2.5} />
                </View>
            )}
        </Animated.View>
    );
};

const StatsOverview = () => {
    const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
    const totalCount = ACHIEVEMENTS.length;

    return (
        <Animated.View
            entering={staggeredCardEnter(0)}
            style={[styles.statsCard, { backgroundColor: colors.surface }]}
        >
            <View style={styles.statItem}>
                <Award size={32} color={colors.gold} strokeWidth={2.5} />
                <View style={styles.statContent}>
                    <Text style={styles.statValue}>
                        {unlockedCount} / {totalCount}
                    </Text>
                    <Text style={styles.statLabel}>達成済み</Text>
                </View>
            </View>
        </Animated.View>
    );
};

// ============================================================================
// PANTALLA PRINCIPAL
// ============================================================================

export default function AchievementsScreen() {
    // Mostrar solo los primeros 3 achievements para que quepa sin scroll
    const displayAchievements = ACHIEVEMENTS.slice(0, 3);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                <View style={styles.scrollContent}>
                    {/* Header */}
                    <Animated.View entering={headerEnter()} style={styles.header}>
                        <Text style={styles.headerTitle}>実績</Text>
                    </Animated.View>

                    {/* Stats Overview */}
                    <StatsOverview />

                    {/* Achievements List */}
                    <View style={styles.achievementsSection}>
                        <Text style={styles.sectionTitle}>最近の実績</Text>
                        {displayAchievements.map((achievement, index) => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                index={index + 1}
                            />
                        ))}
                    </View>
                </View>

                <FloatingNavBar activeTab="achievements" />
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
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: spacing.screen,
        paddingTop: spacing.md,
        paddingBottom: 85,
    },

    // Header
    header: {
        alignItems: 'center',
        paddingBottom: spacing.lg,
    },
    headerTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 20,
        color: colors.text.primary,
        includeFontPadding: false,
    },

    // Stats Card
    statsCard: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 28,
        color: colors.text.primary,
        includeFontPadding: false,
    },
    statLabel: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 13,
        color: colors.text.secondary,
        marginTop: spacing.xs,
        includeFontPadding: false,
    },

    // Achievements Section
    achievementsSection: {
        gap: spacing.md,
    },
    sectionTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: spacing.md,
        includeFontPadding: false,
    },

    // Achievement Card
    achievementCard: {
        flexDirection: 'row',
        borderRadius: radius.md,
        padding: spacing.lg,
        alignItems: 'flex-start',
        gap: spacing.lg,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 15,
        includeFontPadding: false,
        marginBottom: spacing.xs,
    },
    achievementDescription: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        includeFontPadding: false,
        lineHeight: 18,
    },
    badge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Progress
    progressSection: {
        marginTop: spacing.md,
        gap: spacing.xs,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.surfaceLight,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 11,
        color: colors.text.tertiary,
        includeFontPadding: false,
    },
});
