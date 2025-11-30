// app/index.tsx - HOME SCREEN - Material 3 Expressive
import React from "react";
import { View, Dimensions } from "react-native";
import { Text, Surface, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Flame } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const LEVELS_DATA = [
  {
    id: "n5",
    level: "N5",
    titleJp: "初級",
    kanji: "始",
    color: "#F5A238",
    colorLight: "#FEF7ED",
  },
  {
    id: "n4",
    level: "N4",
    titleJp: "初中級",
    kanji: "進",
    color: "#76BF54",
    colorLight: "#F3FAF0",
  },
  {
    id: "n3",
    level: "N3",
    titleJp: "中級",
    kanji: "道",
    color: "#E1444B",
    colorLight: "#FDF2F2",
  },
  {
    id: "n2",
    level: "N2",
    titleJp: "中上級",
    kanji: "翔",
    color: "#4387C8",
    colorLight: "#EFF6FC",
  },
  {
    id: "n1",
    level: "N1",
    titleJp: "上級",
    kanji: "極",
    color: "#9056A2",
    colorLight: "#F8F3FA",
  },
];

const STREAK_COLOR = "#00BCD4";
const STREAK_BG = "#E0F7FA";
const PADDING = 20;
const GAP = 12;

export default function HomeScreen() {
  const router = useRouter();
  const streakDays = 0;
  const cardWidth = (width - PADDING * 2 - GAP) / 2;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top", "bottom"]}
    >
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: PADDING,
          paddingVertical: PADDING,
        }}
      >
        {/* HEADER */}
        <Text
          style={{
            fontFamily: "NotoSansJP_700Bold",
            fontSize: 26,
            color: "#1F2937",
          }}
        >
          こんにちは、クリスチャン
        </Text>

        {/* STREAK CARD */}
        <Surface
          style={{
            backgroundColor: STREAK_BG,
            borderRadius: 20,
            padding: 14,
            marginTop: 12,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
          }}
          elevation={0}
          mode="flat"
        >
          {/* Kanji decorativo 光 (hikari) */}
          <View
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 60,
                lineHeight: 60,
                height: 60,
                color: STREAK_COLOR,
                fontFamily: "NotoSansJP_400Regular",
                opacity: 0.12,
                includeFontPadding: false,
                textAlignVertical: "center",
              }}
            >
              光
            </Text>
          </View>
          <Flame
            size={28}
            color={STREAK_COLOR}
            strokeWidth={2.5}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1, zIndex: 1 }}>
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 18,
                color: STREAK_COLOR,
              }}
            >
              {streakDays} 日連続
            </Text>
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 12,
                color: "#6B7280",
                marginTop: 1,
              }}
            >
              {streakDays === 0 ? "今日から始めよう！" : "素晴らしい！"}
            </Text>
          </View>
        </Surface>

        {/* GRID DE NIVELES */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: GAP,
            alignContent: "space-between",
          }}
        >
          {LEVELS_DATA.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              width={cardWidth}
              onPress={() => router.push(`/levels/${level.id}`)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

type LevelCardProps = {
  level: (typeof LEVELS_DATA)[0];
  width: number;
  onPress: () => void;
};

const KANJI_FONT_SIZE = 65;
const VERTICAL_PADDING = 14;

const LevelCard = ({ level, width, onPress }: LevelCardProps) => {
  return (
    <Surface
      style={{
        width: width,
        height: "32%",
        borderRadius: 24,
        backgroundColor: level.colorLight,
        overflow: "hidden",
      }}
      elevation={0}
      mode="flat"
    >
      <TouchableRipple
        onPress={onPress}
        rippleColor={level.color + "20"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {/* Kanji decorativo */}
          <View
            style={{
              position: "absolute",
              right: 8,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: KANJI_FONT_SIZE,
                lineHeight: KANJI_FONT_SIZE,
                height: KANJI_FONT_SIZE,
                color: level.color,
                fontFamily: "NotoSansJP_400Regular",
                opacity: 0.12,
                includeFontPadding: false,
                textAlignVertical: "center",
              }}
            >
              {level.kanji}
            </Text>
          </View>

          {/* Contenido */}
          <View style={{ flex: 1, zIndex: 1 }}>
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 18,
                color: level.color,
                includeFontPadding: false,
                marginTop: VERTICAL_PADDING,
              }}
            >
              {level.level}
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              style={{
                fontFamily: "NotoSansJP_700Bold",
                fontSize: 20,
                color: level.color,
                includeFontPadding: false,
                marginBottom: VERTICAL_PADDING,
              }}
            >
              {level.titleJp}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};
