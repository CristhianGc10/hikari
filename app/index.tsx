// app/index.tsx
import React from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Flame } from "lucide-react-native";
import { FloatingNavBar } from '@/src/components/navigation/FloatingNavBar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { staggeredCardEnter, headerEnter, pressScale, releaseScale } from "@/src/core/animations";

const { width, height } = Dimensions.get("window");

const colors = {
  bg: "#151621",
  surface: "#1E2030",
  surfaceLight: "#262940",
  text: {
    primary: "#FFFFFF",
    secondary: "#8F92A8",
    tertiary: "#5D6080",
  },
  levels: {
    n5: { primary: "#F0A55A", light: "rgba(240, 165, 90, 0.12)" },
    n4: { primary: "#5AC78B", light: "rgba(90, 199, 139, 0.12)" },
    n3: { primary: "#E86B8A", light: "rgba(232, 107, 138, 0.12)" },
    n2: { primary: "#5A9FE8", light: "rgba(90, 159, 232, 0.12)" },
    n1: { primary: "#A87DE8", light: "rgba(168, 125, 232, 0.12)" },
  },
  navbar: {
    bg: "#1E2030",
    active: "#F0A55A",
    inactive: "#5D6080",
  },
  streak: "#F07A5A",
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28, full: 9999 };

const LEVELS = [
  { id: "n5", label: "N5", kanji: "始", name: "初級", description: "基礎から始める", progress: 0.25 },
  { id: "n4", label: "N4", kanji: "進", name: "初中級", description: "日常会話を学ぶ", progress: 0 },
  { id: "n3", label: "N3", kanji: "道", name: "中級", description: "自然な表現を習得", progress: 0 },
  { id: "n2", label: "N2", kanji: "翔", name: "中上級", description: "複雑な文章を理解", progress: 0 },
  { id: "n1", label: "N1", kanji: "極", name: "上級", description: "ネイティブレベル", progress: 0 },
] as const;


const LevelCard = ({
  level,
  index,
  onPress,
}: {
  level: (typeof LEVELS)[number];
  index: number;
  onPress: () => void;
}) => {
  const levelColors = colors.levels[level.id as keyof typeof colors.levels];
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

  return (
    <Animated.View
      entering={staggeredCardEnter(index)}
      style={styles.levelCardWrapper}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.levelCardWrapper}
      >
        <Animated.View style={[styles.levelCard, { backgroundColor: colors.surface }, animatedStyle]}>
          {/* Header del card */}
          <View style={styles.cardHeader}>
            <View style={[styles.levelBadge, { backgroundColor: levelColors.light }]}>
              <Text style={[styles.levelBadgeText, { color: levelColors.primary }]}>
                {level.label}
              </Text>
            </View>
            <Text style={[styles.levelKanji, { color: levelColors.primary }]}>
              {level.kanji}
            </Text>
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <Text style={styles.levelName}>{level.name}</Text>
            <Text style={styles.levelDescription}>{level.description}</Text>
          </View>

          {/* Progress bar */}
          {level.progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.surfaceLight }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${level.progress * 100}%`, backgroundColor: levelColors.primary },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: levelColors.primary }]}>
                {Math.round(level.progress * 100)}%
              </Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};


export default function HomeScreen() {
  const router = useRouter();

  const handleLevelPress = (levelId: string) => {
    router.push(`/levels/${levelId}`);
  };

  const handleStreakPress = () => {
    router.push('/stats/streak');
  };

  // Cálculos optimizados para simetría y armonía
  const navbarHeight = 73; // Navbar (paddingVertical 12*2 + icon 25 + button padding 8*2 + bottom 16)
  const headerHeight = 68; // Header (greeting + streak + paddings)
  const safeAreaTop = 44;
  const bottomSpacing = spacing.md; // 12px espacio armónico antes del navbar
  const gapBetweenRows = spacing.md; // 12px entre filas
  const availableHeight = height - navbarHeight - headerHeight - safeAreaTop - bottomSpacing;
  const cardHeight = (availableHeight - gapBetweenRows * 2) / 3;
  const cardWidth = (width - spacing.screen * 2 - spacing.md) / 2;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Animated.View entering={headerEnter()} style={styles.header}>
          <Text style={styles.greeting}>こんにちは</Text>
          <Pressable onPress={handleStreakPress} style={styles.streakContainer}>
            <Flame size={18} color={colors.streak} fill={colors.streak} />
            <Text style={styles.streakText}>7</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.levelsContainer}>
          {/* Fila 1: N5, N4 */}
          <View style={styles.levelRow}>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <LevelCard level={LEVELS[0]} index={0} onPress={() => handleLevelPress(LEVELS[0].id)} />
            </View>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <LevelCard level={LEVELS[1]} index={1} onPress={() => handleLevelPress(LEVELS[1].id)} />
            </View>
          </View>

          {/* Fila 2: N3, N2 */}
          <View style={styles.levelRow}>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <LevelCard level={LEVELS[2]} index={2} onPress={() => handleLevelPress(LEVELS[2].id)} />
            </View>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <LevelCard level={LEVELS[3]} index={3} onPress={() => handleLevelPress(LEVELS[3].id)} />
            </View>
          </View>

          {/* Fila 3: N1 alineado a la izquierda (debajo de N3) */}
          <View style={styles.levelRow}>
            <View style={{ width: cardWidth, height: cardHeight }}>
              <LevelCard level={LEVELS[4]} index={4} onPress={() => handleLevelPress(LEVELS[4].id)} />
            </View>
            <View style={{ width: cardWidth, height: cardHeight }} />
          </View>
        </View>
      </View>

      <FloatingNavBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: spacing.screen, paddingBottom: 85 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 24,
    color: colors.text.primary,
    includeFontPadding: false,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    gap: spacing.sm,
  },
  streakText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 16,
    color: colors.text.primary,
    includeFontPadding: false,
  },

  levelsContainer: { flex: 1, gap: spacing.md },
  levelRow: { flexDirection: "row", gap: spacing.md },

  levelCardWrapper: { flex: 1 },
  levelCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: "space-between",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  levelBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  levelBadgeText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 13,
    includeFontPadding: false,
  },
  levelKanji: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 38,
    includeFontPadding: false,
    marginTop: -8,
  },

  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  levelName: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 18,
    color: colors.text.primary,
    includeFontPadding: false,
  },
  levelDescription: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    includeFontPadding: false,
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2 },
  progressText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 11,
    includeFontPadding: false,
  },

});
