// app/modules/kana/practice/[char].tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
  Pressable,
} from "react-native";
import { Surface, Text } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";

import { KanaAnimation } from "@/src/components/kana/KanaAnimation";
import { KanaWriting } from "@/src/components/kana/KanaWriting";

// Servicio de carga de trazos
import { loadStrokesWithMetadata } from "@/src/services/strokeLoader";

// Registro de SVGs
import SVG_REGISTRY from "@/src/data/svgRegistry";

const { width } = Dimensions.get("window");
const CARD_SIZE = width - 48;
const PADDING = 20;

// Colores del selector
const OBSERVE_COLOR = "#F5A238";
const WRITE_COLOR = "#22c55e";

// Mapeo de caracteres a archivos de audio (por romaji/sonido)
// Un solo audio sirve para hiragana y katakana del mismo sonido
const AUDIO_FILES: Record<string, any> = {
  // Vocales
  a: require("@/assets/audio/kana/a.wav"),
  i: require("@/assets/audio/kana/i.wav"),
  u: require("@/assets/audio/kana/u.wav"),
  e: require("@/assets/audio/kana/e.wav"),
  o: require("@/assets/audio/kana/o.wav"),
  ka: require("@/assets/audio/kana/ka.wav"),
  ki: require("@/assets/audio/kana/ki.wav"),
  ku: require("@/assets/audio/kana/ku.wav"),
  ke: require("@/assets/audio/kana/ke.wav"),
  ko: require("@/assets/audio/kana/ko.wav"),
  sa: require("@/assets/audio/kana/sa.wav"),
  shi: require("@/assets/audio/kana/shi.wav"),
  su: require("@/assets/audio/kana/su.wav"),
  se: require("@/assets/audio/kana/se.wav"),
  so: require("@/assets/audio/kana/so.wav"),
  ta: require("@/assets/audio/kana/ta.wav"),
  chi: require("@/assets/audio/kana/chi.wav"),
  tsu: require("@/assets/audio/kana/tsu.wav"),
  te: require("@/assets/audio/kana/te.wav"),
  to: require("@/assets/audio/kana/to.wav"),
  na: require("@/assets/audio/kana/na.wav"),
  ni: require("@/assets/audio/kana/ni.wav"),
  nu: require("@/assets/audio/kana/nu.wav"),
  ne: require("@/assets/audio/kana/ne.wav"),
  no: require("@/assets/audio/kana/no.wav"),
  ha: require("@/assets/audio/kana/ha.wav"),
  hi: require("@/assets/audio/kana/hi.wav"),
  fu: require("@/assets/audio/kana/fu.wav"),
  he: require("@/assets/audio/kana/he.wav"),
  ho: require("@/assets/audio/kana/ho.wav"),
  ma: require("@/assets/audio/kana/ma.wav"),
  mi: require("@/assets/audio/kana/mi.wav"),
  mu: require("@/assets/audio/kana/mu.wav"),
  me: require("@/assets/audio/kana/me.wav"),
  mo: require("@/assets/audio/kana/mo.wav"),
  ya: require("@/assets/audio/kana/ya.wav"),
  yu: require("@/assets/audio/kana/yu.wav"),
  yo: require("@/assets/audio/kana/yo.wav"),
  ra: require("@/assets/audio/kana/ra.wav"),
  ri: require("@/assets/audio/kana/ri.wav"),
  ru: require("@/assets/audio/kana/ru.wav"),
  re: require("@/assets/audio/kana/re.wav"),
  ro: require("@/assets/audio/kana/ro.wav"),
  wa: require("@/assets/audio/kana/wa.wav"),
  wo: require("@/assets/audio/kana/wo.wav"),
  n: require("@/assets/audio/kana/n.wav"),
};

// Mapeo de caracteres a su sonido (romaji)
const CHAR_TO_SOUND: Record<string, string> = {
  // Hiragana vocales
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "wo",
  ん: "n",
  // Katakana vocales
  ア: "a",
  イ: "i",
  ウ: "u",
  エ: "e",
  オ: "o",
  カ: "ka",
  キ: "ki",
  ク: "ku",
  ケ: "ke",
  コ: "ko",
  サ: "sa",
  シ: "shi",
  ス: "su",
  セ: "se",
  ソ: "so",
  タ: "ta",
  チ: "chi",
  ツ: "tsu",
  テ: "te",
  ト: "to",
  ナ: "na",
  ニ: "ni",
  ヌ: "nu",
  ネ: "ne",
  ノ: "no",
  ハ: "ha",
  ヒ: "hi",
  フ: "fu",
  ヘ: "he",
  ホ: "ho",
  マ: "ma",
  ミ: "mi",
  ム: "mu",
  メ: "me",
  モ: "mo",
  ヤ: "ya",
  ユ: "yu",
  ヨ: "yo",
  ラ: "ra",
  リ: "ri",
  ル: "ru",
  レ: "re",
  ロ: "ro",
  ワ: "wa",
  ヲ: "wo",
  ン: "n",
};

export default function KanaPracticeScreen() {
  const { char } = useLocalSearchParams();
  const character = Array.isArray(char) ? char[0] : char || "あ";

  const [strokes, setStrokes] = useState<string[]>([]);
  const [strokeWidth, setStrokeWidth] = useState<number>(6);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"observe" | "write">("observe");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Animación del selector
  const slideAnim = useRef(new Animated.Value(0)).current;
  const selectorWidth = (width - PADDING * 2 - 8) / 2;

  // Determinar si el caracter tiene audio
  const soundKey = CHAR_TO_SOUND[character];
  const hasAudio = Boolean(soundKey && soundKey in AUDIO_FILES);
  const audioSource = hasAudio ? AUDIO_FILES[soundKey] : null;

  // Hook de audio
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: mode === "observe" ? 0 : selectorWidth,
      useNativeDriver: true,
      tension: 100,
      friction: 12,
    }).start();
  }, [mode]);

  useEffect(() => {
    loadData();
  }, [character]);

  // Escuchar cambios en el estado del player para detectar cuando termina
  useEffect(() => {
    if (!player || !hasAudio) return;

    // Usar un intervalo para verificar el estado de reproducción
    let checkInterval: ReturnType<typeof setInterval> | null = null;

    if (isPlayingAudio) {
      checkInterval = setInterval(() => {
        if (!player.playing) {
          setIsPlayingAudio(false);
          if (checkInterval) clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [player, hasAudio, isPlayingAudio]);

  const loadData = () => {
    setLoading(true);
    try {
      const result = loadStrokesWithMetadata(character, SVG_REGISTRY);
      setStrokes(result.strokes);
      setStrokeWidth(result.strokeWidth);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    if (!hasAudio || isPlayingAudio || !player) return;

    try {
      setIsPlayingAudio(true);
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
    }
  };

  // Color activo según el modo
  const activeColor = mode === "observe" ? OBSERVE_COLOR : WRITE_COLOR;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Selector de modo */}
      <View style={{ paddingHorizontal: PADDING, paddingVertical: 16 }}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F3F4F6",
            borderRadius: 10,
            padding: 4,
            position: "relative",
          }}
        >
          {/* Selector animado */}
          <Animated.View
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: 4,
              width: "50%",
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              transform: [{ translateX: slideAnim }],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          />

          {/* Botón Observar */}
          <Pressable
            onPress={() => setMode("observe")}
            style={{ flex: 1, zIndex: 1 }}
          >
            <View
              style={{
                paddingVertical: 8,
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSansJP_700Bold",
                  fontSize: 18,
                  color: mode === "observe" ? OBSERVE_COLOR : "#9CA3AF",
                }}
              >
                観る
              </Text>
            </View>
          </Pressable>

          {/* Botón Escribir */}
          <Pressable
            onPress={() => setMode("write")}
            style={{ flex: 1, zIndex: 1 }}
          >
            <View
              style={{
                paddingVertical: 8,
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSansJP_700Bold",
                  fontSize: 18,
                  color: mode === "write" ? WRITE_COLOR : "#9CA3AF",
                }}
              >
                書く
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={activeColor} />
          </View>
        ) : strokes.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansJP_400Regular",
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              No hay datos de trazos disponibles para este carácter.
            </Text>
          </View>
        ) : (
          <>
            {mode === "observe" ? (
              <KanaAnimation
                strokes={strokes}
                size={CARD_SIZE}
                strokeWidth={strokeWidth}
                hasAudio={hasAudio}
                isPlayingAudio={isPlayingAudio}
                onPlayAudio={playAudio}
              />
            ) : (
              <KanaWriting
                strokes={strokes}
                size={CARD_SIZE}
                strokeWidth={strokeWidth}
                hasAudio={hasAudio}
                isPlayingAudio={isPlayingAudio}
                onPlayAudio={playAudio}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
