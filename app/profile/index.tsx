// app/profile/index.tsx
import React from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { User, Target, BookOpen, Calendar, TrendingUp, Settings, Bell, Globe } from 'lucide-react-native';
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
    levels: {
        n5: { primary: '#F0A55A', light: 'rgba(240, 165, 90, 0.12)' },
    },
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// ============================================================================
// COMPONENTES
// ============================================================================

const ProfileHeader = () => {
    return (
        <Animated.View
            entering={staggeredCardEnter(0)}
            style={[styles.profileCard, { backgroundColor: colors.surface }]}
        >
            <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: colors.levels.n5.light }]}>
                    <User size={32} color={colors.levels.n5.primary} strokeWidth={2.5} />
                </View>
            </View>

            <Text style={styles.profileName}>学習者</Text>
            <Text style={styles.profileLevel}>レベル N5</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: colors.levels.n5.primary }]}>156</Text>
                    <Text style={styles.statLabel}>学習日数</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: colors.levels.n5.primary }]}>825</Text>
                    <Text style={styles.statLabel}>習得単語</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: colors.levels.n5.primary }]}>7</Text>
                    <Text style={styles.statLabel}>連続日数</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const ProgressCard = () => {
    const levelProgress = 65; // Progreso del nivel actual

    return (
        <Animated.View
            entering={staggeredCardEnter(1)}
            style={[styles.progressCard, { backgroundColor: colors.surface }]}
        >
            <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>学習進捗</Text>
                <Text style={[styles.progressPercentage, { color: colors.levels.n5.primary }]}>
                    {levelProgress}%
                </Text>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${levelProgress}%`,
                                backgroundColor: colors.levels.n5.primary,
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.milestoneRow}>
                <View style={styles.milestone}>
                    <Target size={18} color={colors.levels.n5.primary} strokeWidth={2.5} />
                    <Text style={styles.milestoneText}>目標達成まで 35%</Text>
                </View>
            </View>
        </Animated.View>
    );
};

type MenuItemProps = {
    icon: any;
    title: string;
    subtitle: string;
    index: number;
};

const MenuItem = ({ icon: Icon, title, subtitle, index }: MenuItemProps) => {
    return (
        <Animated.View
            entering={staggeredCardEnter(2 + index, 80, 30)}
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
        >
            <View style={[styles.menuIcon, { backgroundColor: colors.surfaceLight }]}>
                <Icon size={18} color={colors.text.secondary} strokeWidth={2.5} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
        </Animated.View>
    );
};

// ============================================================================
// PANTALLA PRINCIPAL
// ============================================================================

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                <View style={styles.scrollContent}>
                    {/* Header */}
                    <Animated.View entering={headerEnter()} style={styles.header}>
                        <Text style={styles.headerTitle}>プロフィール</Text>
                    </Animated.View>

                    {/* Profile Header */}
                    <ProfileHeader />

                    {/* Progress Card */}
                    <ProgressCard />

                    {/* Menu Section - Solo 2 items */}
                    <View style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>設定</Text>

                        <MenuItem
                            icon={Settings}
                            title="一般設定"
                            subtitle="アプリの基本設定を変更"
                            index={0}
                        />
                        <MenuItem
                            icon={Bell}
                            title="通知設定"
                            subtitle="リマインダーと通知を管理"
                            index={1}
                        />
                    </View>
                </View>

                <FloatingNavBar activeTab="profile" />
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

    // Profile Card
    profileCard: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    avatarContainer: {
        marginBottom: spacing.md,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 20,
        color: colors.text.primary,
        includeFontPadding: false,
        marginBottom: 4,
    },
    profileLevel: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.secondary,
        includeFontPadding: false,
        marginBottom: spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 18,
        includeFontPadding: false,
        marginBottom: 4,
    },
    statLabel: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 10,
        color: colors.text.secondary,
        includeFontPadding: false,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: colors.surfaceLight,
    },

    // Progress Card
    progressCard: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    progressTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 16,
        color: colors.text.primary,
        includeFontPadding: false,
    },
    progressPercentage: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 18,
        includeFontPadding: false,
    },
    progressBarContainer: {
        marginBottom: spacing.lg,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.surfaceLight,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    milestoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    milestone: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    milestoneText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 13,
        color: colors.text.secondary,
        includeFontPadding: false,
    },

    // Menu Section
    menuSection: {
        gap: spacing.md,
    },
    sectionTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: spacing.md,
        includeFontPadding: false,
    },
    menuItem: {
        flexDirection: 'row',
        borderRadius: radius.md,
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.lg,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 14,
        color: colors.text.primary,
        includeFontPadding: false,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.secondary,
        includeFontPadding: false,
    },

    // Version
    versionContainer: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    versionText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 12,
        color: colors.text.tertiary,
        includeFontPadding: false,
    },
});
