// app/levels/[id].tsx
import React from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  PenTool,
  BookOpen,
  BookText,
  Languages,
  Headphones,
  FileText,
} from "lucide-react-native";
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
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28, full: 9999 };

const LEVEL_INFO = {
  n5: { kanji: "始", name: "初級", subtitle: "基礎レベル" },
  n4: { kanji: "進", name: "初中級", subtitle: "基本会話" },
  n3: { kanji: "道", name: "中級", subtitle: "日常会話" },
  n2: { kanji: "翔", name: "中上級", subtitle: "ビジネス" },
  n1: { kanji: "極", name: "上級", subtitle: "ネイティブ" },
} as const;

const MODULES = [
  { id: "kana", title: "仮名", subtitle: "基本文字", detail: "104文字", progress: 0.65, icon: PenTool, unlocked: true, route: "/modules/kana" },
  { id: "vocab", title: "語彙", subtitle: "単語と表現", detail: "800語", progress: 0.23, icon: BookOpen, unlocked: true, route: "/modules/vocab" },
  { id: "grammar", title: "文法", subtitle: "文の構造", detail: "45文型", progress: 0, icon: BookText, unlocked: false, route: "/modules/grammar" },
  { id: "kanji", title: "漢字", subtitle: "漢字学習", detail: "103字", progress: 0, icon: Languages, unlocked: false, route: "/modules/kanji" },
  { id: "listening", title: "聴解", subtitle: "リスニング", detail: "30問題", progress: 0, icon: Headphones, unlocked: false, route: "/modules/listening" },
  { id: "reading", title: "読解", subtitle: "読み取り", detail: "25課題", progress: 0, icon: FileText, unlocked: false, route: "/modules/reading" },
] as const;

const ModuleCard = ({
  module,
  index,
  levelColor,
  onPress,
}: {
  module: (typeof MODULES)[number];
  index: number;
  levelColor: { primary: string; light: string };
  onPress: () => void;
}) => {
  const Icon = module.icon;
  const isLocked = !module.unlocked;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isLocked) {
      scale.value = pressScale(0.96);
    }
  };

  const handlePressOut = () => {
    scale.value = releaseScale();
  };

  return (
    <Animated.View
      entering={staggeredCardEnter(index, 100, 50)}
      style={styles.moduleWrapper}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLocked}
        style={styles.moduleWrapper}
      >
        <Animated.View
          style={[
            styles.moduleCard,
            {
              backgroundColor: colors.surface,
              opacity: isLocked ? 0.35 : 1,
            },
            animatedStyle,
          ]}
        >
          <View style={styles.cardTop}>
            <Icon
              size={32}
              color={isLocked ? colors.text.tertiary : levelColor.primary}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.detailText,
                { color: isLocked ? colors.text.tertiary : levelColor.primary }
              ]}
            >
              {module.detail}
            </Text>
          </View>

          <View style={styles.cardBottom}>
            <View style={styles.textGroup}>
              <Text
                style={[
                  styles.moduleTitle,
                  { color: isLocked ? colors.text.tertiary : colors.text.primary },
                ]}
              >
                {module.title}
              </Text>
              <Text
                style={[
                  styles.moduleSubtitle,
                  { color: isLocked ? colors.text.tertiary : colors.text.secondary },
                ]}
                numberOfLines={1}
              >
                {module.subtitle}
              </Text>
            </View>

            {/* Barra de progreso */}
            {module.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressTrack, { backgroundColor: levelColor.light }]}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${module.progress * 100}%`,
                        backgroundColor: levelColor.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: levelColor.primary }]}>
                  {Math.round(module.progress * 100)}%
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function LevelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const levelId = (Array.isArray(id) ? id[0] : id) || "n5";

  const levelColor = colors.levels[levelId as keyof typeof colors.levels] || colors.levels.n5;
  const levelInfo = LEVEL_INFO[levelId as keyof typeof LEVEL_INFO] || LEVEL_INFO.n5;

  const handleModulePress = (route: string) => {
    router.push(route as any);
  };

  const headerHeight = 100;
  const safeAreaTop = 50;
  const bottomPadding = 30;
  const availableHeight = height - headerHeight - safeAreaTop - bottomPadding;
  const cardHeight = (availableHeight - spacing.md * 2) / 3;
  const cardWidth = (width - spacing.screen * 2 - spacing.md) / 2;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        {/* Header limpio y armonioso */}
        <Animated.View entering={headerEnter()} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.levelBadge, { backgroundColor: levelColor.light }]}>
              <Text style={[styles.levelBadgeText, { color: levelColor.primary }]}>
                {levelId.toUpperCase()}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.levelName}>{levelInfo.name}</Text>
              <Text style={styles.levelSubtitle}>{levelInfo.subtitle}</Text>
            </View>
          </View>
          <Text style={[styles.levelKanji, { color: levelColor.primary }]}>
            {levelInfo.kanji}
          </Text>
        </Animated.View>

        {/* Grid de módulos */}
        <View style={styles.modulesContainer}>
          {/* Fila 1 */}
          <View style={styles.moduleRow}>
            {MODULES.slice(0, 2).map((module, index) => (
              <View key={module.id} style={{ width: cardWidth, height: cardHeight }}>
                <ModuleCard
                  module={module}
                  index={index}
                  levelColor={levelColor}
                  onPress={() => handleModulePress(module.route)}
                />
              </View>
            ))}
          </View>

          {/* Fila 2 */}
          <View style={styles.moduleRow}>
            {MODULES.slice(2, 4).map((module, index) => (
              <View key={module.id} style={{ width: cardWidth, height: cardHeight }}>
                <ModuleCard
                  module={module}
                  index={index + 2}
                  levelColor={levelColor}
                  onPress={() => handleModulePress(module.route)}
                />
              </View>
            ))}
          </View>

          {/* Fila 3 */}
          <View style={styles.moduleRow}>
            {MODULES.slice(4, 6).map((module, index) => (
              <View key={module.id} style={{ width: cardWidth, height: cardHeight }}>
                <ModuleCard
                  module={module}
                  index={index + 4}
                  levelColor={levelColor}
                  onPress={() => handleModulePress(module.route)}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
  },

  // Header - diseño horizontal limpio
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  levelBadgeText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 12,
    includeFontPadding: false,
    letterSpacing: 0.8,
  },
  titleContainer: {
    flex: 1,
  },
  levelName: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 28,
    color: colors.text.primary,
    includeFontPadding: false,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  levelSubtitle: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 14,
    color: colors.text.secondary,
    includeFontPadding: false,
    marginTop: 2,
  },
  levelKanji: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 52,
    includeFontPadding: false,
    lineHeight: 52,
    marginLeft: spacing.md,
  },

  // Grid de módulos
  modulesContainer: {
    flex: 1,
    gap: spacing.md,
  },
  moduleRow: {
    flexDirection: "row",
    gap: spacing.md,
  },

  // Tarjetas de módulos - diseño limpio
  moduleWrapper: {
    flex: 1,
  },
  moduleCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg + 4,
    justifyContent: "space-between",
  },

  // Parte superior de la tarjeta (icono + detalle)
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  // Parte inferior de la tarjeta (textos + progreso)
  cardBottom: {
    gap: spacing.sm,
  },
  textGroup: {
    gap: 4,
  },
  moduleTitle: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 18,
    includeFontPadding: false,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  moduleSubtitle: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 12,
    includeFontPadding: false,
    lineHeight: 16,
    opacity: 0.8,
  },

  // Texto de detalle
  detailText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 11,
    includeFontPadding: false,
    letterSpacing: 0.3,
    opacity: 0.7,
  },

  // Progreso
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 10,
    includeFontPadding: false,
    letterSpacing: 0.3,
    opacity: 0.8,
  },
});
