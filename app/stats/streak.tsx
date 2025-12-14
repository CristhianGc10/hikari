// app/stats/streak.tsx
import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Flame, Calendar, Trophy, TrendingUp } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { headerEnter, staggeredCardEnter } from '@/src/core/animations';

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
    streak: '#F07A5A',
    success: '#10B981',
    warning: '#F59E0B',
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// ============================================================================
// DATOS DE EJEMPLO
// ============================================================================

const WEEKLY_STATS = [
    { day: '月', completed: true, date: '12/09' },
    { day: '火', completed: true, date: '12/10' },
    { day: '水', completed: true, date: '12/11' },
    { day: '木', completed: true, date: '12/12' },
    { day: '金', completed: true, date: '12/13' },
    { day: '土', completed: false, date: '12/14' },
    { day: '日', completed: false, date: '12/15' },
];

// ============================================================================
// COMPONENTES
// ============================================================================

const StatCard = ({
    icon: Icon,
    value,
    label,
    color,
    index,
}: {
    icon: any;
    value: string;
    label: string;
    color: string;
    index: number;
}) => {
    return (
        <Animated.View
            entering={staggeredCardEnter(index + 1, 100, 50)}
            style={[styles.statCard, { backgroundColor: colors.surface }]}
        >
            <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
                <Icon size={24} color={color} strokeWidth={2.5} />
            </View>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </Animated.View>
    );
};

const WeeklyProgress = () => {
    return (
        <Animated.View
            entering={staggeredCardEnter(4, 80, 50)}
            style={[styles.weeklyContainer, { backgroundColor: colors.surface }]}
        >
            <Text style={styles.weeklyTitle}>今週の進捗</Text>
            <View style={styles.weeklyGrid}>
                {WEEKLY_STATS.map((day, index) => (
                    <View key={index} style={styles.dayColumn}>
                        <View
                            style={[
                                styles.dayCircle,
                                {
                                    backgroundColor: day.completed
                                        ? `${colors.streak}20`
                                        : colors.surfaceLight,
                                    borderWidth: day.completed ? 2 : 1,
                                    borderColor: day.completed
                                        ? colors.streak
                                        : colors.text.tertiary,
                                },
                            ]}
                        >
                            {day.completed && (
                                <Flame size={20} color={colors.streak} fill={colors.streak} />
                            )}
                        </View>
                        <Text style={styles.dayText}>{day.day}</Text>
                        <Text style={styles.dateText}>{day.date}</Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const MotivationalMessage = () => {
    return (
        <Animated.View
            entering={staggeredCardEnter(5, 80, 50)}
            style={[styles.messageContainer, { backgroundColor: `${colors.streak}15` }]}
        >
            <Flame size={32} color={colors.streak} fill={colors.streak} />
            <View style={styles.messageContent}>
                <Text style={styles.messageTitle}>素晴らしい！</Text>
                <Text style={styles.messageText}>
                    7日連続で学習しています。この調子で続けましょう！
                </Text>
            </View>
        </Animated.View>
    );
};

// ============================================================================
// PANTALLA PRINCIPAL
// ============================================================================

export default function StreakStatsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                {/* Header */}
                <Animated.View entering={headerEnter()} style={styles.header}>
                    <Text style={styles.headerTitle}>学習記録</Text>
                </Animated.View>

                {/* Main Streak Display */}
                <Animated.View
                    entering={staggeredCardEnter(0)}
                    style={[styles.mainStreakCard, { backgroundColor: colors.surface }]}
                >
                    <View style={styles.mainStreakIconContainer}>
                        <Flame size={40} color={colors.streak} fill={colors.streak} />
                    </View>
                    <Text style={[styles.mainStreakValue, { color: colors.streak }]}>7</Text>
                    <Text style={styles.mainStreakLabel}>日連続</Text>
                    <Text style={styles.mainStreakSubtext}>最長記録: 12日</Text>
                </Animated.View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard
                        icon={Calendar}
                        value="5"
                        label="今週"
                        color={colors.success}
                        index={0}
                    />
                    <StatCard
                        icon={Trophy}
                        value="28"
                        label="今月"
                        color={colors.warning}
                        index={1}
                    />
                    <StatCard
                        icon={TrendingUp}
                        value="156"
                        label="合計"
                        color={colors.streak}
                        index={2}
                    />
                </View>

                {/* Weekly Progress */}
                <WeeklyProgress />

                {/* Motivational Message */}
                <MotivationalMessage />
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

    // Header
    header: {
        alignItems: 'center',
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
    },
    headerTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 22,
        color: colors.text.primary,
        includeFontPadding: false,
    },

    // Main Streak Card
    mainStreakCard: {
        borderRadius: radius.lg,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    mainStreakIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${colors.streak}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    mainStreakValue: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 52,
        includeFontPadding: false,
        lineHeight: 56,
    },
    mainStreakLabel: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 16,
        color: colors.text.primary,
        marginTop: spacing.xs,
        includeFontPadding: false,
    },
    mainStreakSubtext: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: spacing.xs,
        includeFontPadding: false,
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    statCard: {
        flex: 1,
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 22,
        includeFontPadding: false,
        lineHeight: 26,
    },
    statLabel: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 2,
        includeFontPadding: false,
    },

    // Weekly Progress
    weeklyContainer: {
        borderRadius: radius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    weeklyTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 14,
        color: colors.text.primary,
        marginBottom: spacing.md,
        includeFontPadding: false,
    },
    weeklyGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayColumn: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    dayCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 11,
        color: colors.text.primary,
        includeFontPadding: false,
    },
    dateText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 9,
        color: colors.text.tertiary,
        includeFontPadding: false,
    },

    // Motivational Message
    messageContainer: {
        flexDirection: 'row',
        borderRadius: radius.md,
        padding: spacing.lg,
        gap: spacing.md,
        alignItems: 'center',
    },
    messageContent: {
        flex: 1,
    },
    messageTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 14,
        color: colors.text.primary,
        marginBottom: spacing.xs,
        includeFontPadding: false,
    },
    messageText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.secondary,
        lineHeight: 18,
        includeFontPadding: false,
    },
});
