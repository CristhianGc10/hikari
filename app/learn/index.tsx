// app/learn/index.tsx
import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BookText, Languages, Pencil, Brain } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { staggeredCardEnter, headerEnter, pressScale, releaseScale } from '@/src/core/animations';
import { FloatingNavBar } from '@/src/components/navigation/FloatingNavBar';

const { width, height } = Dimensions.get('window');

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
    n4: { primary: '#5AC78B', light: 'rgba(90, 199, 139, 0.12)' },
    n3: { primary: '#E86B8A', light: 'rgba(232, 107, 138, 0.12)' },
    n2: { primary: '#5A9FE8', light: 'rgba(90, 159, 232, 0.12)' },
  },
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

type LearningModule = {
  id: string;
  title: string;
  subtitle: string;
  kanji: string;
  description: string;
  route: string;
  color: { primary: string; light: string };
  icon: any;
  progress: number;
};

const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'kana',
    title: '仮名',
    subtitle: 'かな',
    kanji: '字',
    description: 'ひらがな・カタカナ',
    route: '/modules/kana',
    color: colors.levels.n5,
    icon: Languages,
    progress: 0.68,
  },
  {
    id: 'vocab',
    title: '語彙',
    subtitle: 'ごい',
    kanji: '語',
    description: '基本単語を学ぶ',
    route: '/modules/vocab',
    color: colors.levels.n4,
    icon: BookText,
    progress: 0.23,
  },
  {
    id: 'kanji',
    title: '漢字',
    subtitle: 'かんじ',
    kanji: '文',
    description: '漢字を習得する',
    route: '/modules/kanji',
    color: colors.levels.n3,
    icon: Pencil,
    progress: 0,
  },
  {
    id: 'grammar',
    title: '文法',
    subtitle: 'ぶんぽう',
    kanji: '法',
    description: '文法を理解する',
    route: '/modules/grammar',
    color: colors.levels.n2,
    icon: Brain,
    progress: 0,
  },
];

const ModuleCard = ({
  module,
  index,
  onPress,
}: {
  module: LearningModule;
  index: number;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = pressScale(0.97);
  };

  const handlePressOut = () => {
    scale.value = releaseScale();
  };

  const Icon = module.icon;

  return (
    <Animated.View
      entering={staggeredCardEnter(index, 60, 60)}
      style={styles.moduleCardWrapper}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.moduleCardWrapper}
      >
        <Animated.View style={[styles.moduleCard, { backgroundColor: colors.surface }, animatedStyle]}>
          {/* Header del card */}
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: module.color.light }]}>
              <Icon size={28} color={module.color.primary} strokeWidth={2.5} />
            </View>
            <Text style={[styles.moduleKanji, { color: module.color.primary }]}>
              {module.kanji}
            </Text>
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <View style={styles.titleGroup}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
            </View>
            <Text style={styles.moduleDescription}>{module.description}</Text>
          </View>

          {/* Progress bar - siempre visible */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.surfaceLight }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${module.progress * 100}%`, backgroundColor: module.color.primary },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: module.color.primary }]}>
              {Math.round(module.progress * 100)}%
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function LearnScreen() {
  const router = useRouter();

  const handleModulePress = (route: string) => {
    router.push(route as any);
  };

  // Cálculos optimizados para simetría
  const navbarHeight = 73; // Navbar reducido y simétrico
  const headerHeight = 95; // Header (título + subtítulo + paddings + marginBottom)
  const safeAreaTop = 44;
  const bottomSpacing = spacing.md; // 12px espacio armónico antes del navbar
  const gapBetweenRows = spacing.md; // 12px entre filas
  const availableHeight = height - navbarHeight - headerHeight - safeAreaTop - bottomSpacing;
  const cardHeight = (availableHeight - gapBetweenRows) / 2;
  const cardWidth = (width - spacing.screen * 2 - spacing.md) / 2;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Animated.View entering={headerEnter()} style={styles.header}>
          <Text style={styles.greeting}>学習</Text>
          <Text style={styles.subGreeting}>何を学びたいですか？</Text>
        </Animated.View>

        <View style={styles.modulesContainer}>
          {/* Fila 1: Kana, Vocab */}
          <View style={styles.moduleRow}>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <ModuleCard
                module={LEARNING_MODULES[0]}
                index={0}
                onPress={() => handleModulePress(LEARNING_MODULES[0].route)}
              />
            </View>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <ModuleCard
                module={LEARNING_MODULES[1]}
                index={1}
                onPress={() => handleModulePress(LEARNING_MODULES[1].route)}
              />
            </View>
          </View>

          {/* Fila 2: Kanji, Grammar */}
          <View style={styles.moduleRow}>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <ModuleCard
                module={LEARNING_MODULES[2]}
                index={2}
                onPress={() => handleModulePress(LEARNING_MODULES[2].route)}
              />
            </View>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <ModuleCard
                module={LEARNING_MODULES[3]}
                index={3}
                onPress={() => handleModulePress(LEARNING_MODULES[3].route)}
              />
            </View>
          </View>
        </View>
      </View>

      <FloatingNavBar activeTab="learn" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: spacing.screen, paddingBottom: 85 },

  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  greeting: {
    fontFamily: 'NotoSansJP_700Bold',
    fontSize: 28,
    color: colors.text.primary,
    includeFontPadding: false,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subGreeting: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 14,
    color: colors.text.secondary,
    includeFontPadding: false,
  },

  modulesContainer: { flex: 1, gap: spacing.md },
  moduleRow: { flexDirection: 'row', gap: spacing.md },

  moduleCardWrapper: { flex: 1 },
  moduleCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleKanji: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 42,
    includeFontPadding: false,
    marginTop: -8,
  },

  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  titleGroup: {
    gap: spacing.xs,
  },
  moduleTitle: {
    fontFamily: 'NotoSansJP_700Bold',
    fontSize: 22,
    color: colors.text.primary,
    includeFontPadding: false,
    letterSpacing: -0.3,
  },
  moduleSubtitle: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 13,
    color: colors.text.secondary,
    includeFontPadding: false,
    opacity: 0.8,
  },
  moduleDescription: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 13,
    color: colors.text.secondary,
    includeFontPadding: false,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: {
    fontFamily: 'NotoSansJP_700Bold',
    fontSize: 12,
    includeFontPadding: false,
    minWidth: 36,
    textAlign: 'right',
  },
});
