import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  PanResponder,
} from "react-native";
import { Surface, Button, TouchableRipple, Text } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { svgPathProperties } from "svg-path-properties";

// --- ÍNDICE DE KANJIVG ---
import KVG_INDEX from "../../../../assets/kvg-index.json";

// --- IMPORT DE SVG COMO TEXTO ---
import kana03042 from "../../../../assets/kanjivg/03042.svg";

// --- MAPA DE SVG COMO STRINGS ---
const SVG_FILES: Record<string, string> = {
  "03042.svg": kana03042,
};

const extractPathsFromSvg = (svgContent: string): string[] => {
  const paths: string[] = [];
  const regex = /<path[^>]*\sd="([^"]+)"/g;
  let match;
  while ((match = regex.exec(svgContent)) !== null) {
    paths.push(match[1]);
  }
  return paths;
};

const STROKE_COLOR = "#1c1917";
const GUIDELINE_COLOR = "#e5e5e5";
const SUCCESS_COLOR = "#22c55e";
const ERROR_COLOR = "#ef4444";

const { width } = Dimensions.get("window");
const CARD_SIZE = width - 48;
const CANVAS_SIZE = 260;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function KanaPracticeScreen() {
  const { char } = useLocalSearchParams();

  const character = Array.isArray(char) ? char[0] : char || "あ";

  const [strokes, setStrokes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Para controlar “Repetir” desde fuera de la tarjeta de escritura
  const [writingFinished, setWritingFinished] = useState(false);
  const [writingResetKey, setWritingResetKey] = useState(0);

  useEffect(() => {
    loadSvgData();
  }, [character]);

  const loadSvgData = async () => {
    try {
      setLoading(true);

      const fileEntry = (KVG_INDEX as any)[character];

      if (!fileEntry || fileEntry.length === 0) {
        console.warn(`No se encontró entrada en kvg-index para: ${character}`);
        return;
      }

      const filename = fileEntry[0];

      const svgContent = SVG_FILES[filename];

      if (!svgContent) {
        console.warn(`El archivo ${filename} no está registrado en SVG_FILES.`);
        return;
      }

      const extractedPaths = extractPathsFromSvg(svgContent);
      setStrokes(extractedPaths);
    } catch (error) {
      console.error("Error cargando SVG:", error);
    } finally {
      setLoading(false);
      setWritingFinished(false);
      setWritingResetKey((k) => k + 1); // resetea escritura al cambiar de carácter
    }
  };

  const handleResetWriting = () => {
    setWritingFinished(false);
    setWritingResetKey((k) => k + 1);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#FAFAF9" }}
        edges={["top"]}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <ScrollView
          contentContainerStyle={{
            padding: 24,
            gap: 24,
            paddingBottom: 40,
          }}
        >
          {loading ? (
            <View
              style={{
                height: CARD_SIZE,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={SUCCESS_COLOR} />
              <Text style={{ marginTop: 16, color: "#78716c" }}>
                Cargando {character}...
              </Text>
            </View>
          ) : (
            <>
              {/* Tarjeta de animación */}
              <AnimationCard strokes={strokes} />

              {/* Tarjeta de escritura */}
              <WritingCard
                strokes={strokes}
                resetKey={writingResetKey}
                onFinished={() => setWritingFinished(true)}
              />

              {/* Botón Repetir, FUERA de la tarjeta de escritura */}
              {writingFinished && (
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Button
                    mode="contained"
                    onPress={handleResetWriting}
                    buttonColor={SUCCESS_COLOR}
                  >
                    Repetir
                  </Button>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

/* ================== TARJETA DE ANIMACIÓN ================== */

const AnimationCard = ({ strokes }: { strokes: string[] }) => {
  const [key, setKey] = useState(0);

  if (!strokes.length) {
    return null;
  }

  return (
    <Surface
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 32,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      elevation={1}
    >
      <TouchableRipple
        onPress={() => setKey((k) => k + 1)}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        borderless={true}
      >
        <View
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            borderRadius: 20,
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
        >
          <Svg width="100%" height="100%" viewBox="0 0 109 109">
            {/* Guía de fondo (solo cruz, sin marco) */}
            <G opacity={0.08}>
              <Path
                d="M54.5,0 L54.5,109 M0,54.5 L109,54.5"
                stroke="#000"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </G>

            {/* Trazos base en gris claro */}
            <G>
              {strokes.map((d, i) => (
                <Path
                  key={i}
                  d={d}
                  stroke={GUIDELINE_COLOR}
                  strokeWidth={4}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </G>

            {/* Animación de cada trazo */}
            <G key={key}>
              {strokes.map((d, i) => (
                <SingleStrokeAnimation key={i} d={d} index={i} />
              ))}
            </G>
          </Svg>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

const SingleStrokeAnimation = ({ d, index }: { d: string; index: number }) => {
  const progress = useSharedValue(0);

  const length = useMemo(() => {
    try {
      return new svgPathProperties(d).getTotalLength();
    } catch {
      return 100;
    }
  }, [d]);

  useEffect(() => {
    const delay = index * 800; // ms
    progress.value = 0;

    const timeout = setTimeout(() => {
      progress.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });
    }, delay + 200);

    return () => clearTimeout(timeout);
  }, [index, length]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: length * (1 - progress.value),
    // Oculta el trazo mientras no ha empezado la animación (evita “puntitos”)
    opacity: progress.value === 0 ? 0 : 1,
  }));

  return (
    <AnimatedPath
      d={d}
      stroke={STROKE_COLOR}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={length}
      animatedProps={animatedProps}
    />
  );
};

/* ================== TARJETA DE ESCRITURA ================== */

type WritingCardProps = {
  strokes: string[];
  resetKey: number;
  onFinished: () => void;
};

const WritingCard = ({ strokes, resetKey, onFinished }: WritingCardProps) => {
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [userPath, setUserPath] = useState<string>("");
  const [completedPaths, setCompletedPaths] = useState<string[]>([]);
  const [feedbackColor, setFeedbackColor] = useState<string>(STROKE_COLOR);
  const [isFinished, setIsFinished] = useState(false);

  const currentPoints = useRef<{ x: number; y: number }[]>([]);

  // Reset cuando cambia resetKey (desde el padre al pulsar “Repetir” o al cambiar char)
  useEffect(() => {
    setCurrentStrokeIndex(0);
    setCompletedPaths([]);
    setUserPath("");
    setIsFinished(false);
    setFeedbackColor(STROKE_COLOR);
    currentPoints.current = [];
  }, [resetKey]);

  const targetProperties = useMemo(() => {
    if (!strokes[currentStrokeIndex]) return null;
    try {
      return new svgPathProperties(strokes[currentStrokeIndex]);
    } catch {
      return null;
    }
  }, [strokes, currentStrokeIndex]);

  const validateStroke = () => {
    if (!targetProperties) {
      setUserPath("");
      currentPoints.current = [];
      return;
    }

    const userPoints = currentPoints.current;
    if (userPoints.length < 5) {
      setUserPath("");
      currentPoints.current = [];
      return;
    }

    const targetLen = targetProperties.getTotalLength();
    const startTarget = targetProperties.getPointAtLength(0);

    const startUser = userPoints[0];
    const distStart = Math.hypot(
      startUser.x - startTarget.x,
      startUser.y - startTarget.y
    );

    let matchScore = 0;
    const samples = 10;
    for (let i = 0; i <= samples; i++) {
      const targetP = targetProperties.getPointAtLength(
        (targetLen * i) / samples
      );
      const minDist = userPoints.reduce((min, p) => {
        const d = Math.hypot(p.x - targetP.x, p.y - targetP.y);
        return d < min ? d : min;
      }, 1000);
      if (minDist < 10) matchScore++; // tolerancia baja => más rigurosa
    }

    const isStartValid = distStart < 15; // inicio muy cercano
    const isShapeValid = matchScore >= samples * 0.7; // 70% de coincidencia

    if (isStartValid && isShapeValid) {
      setFeedbackColor(SUCCESS_COLOR);
      setTimeout(() => {
        const nextIndex = currentStrokeIndex + 1;

        setCompletedPaths((prev) => [...prev, strokes[currentStrokeIndex]]);
        setUserPath("");
        currentPoints.current = [];

        if (nextIndex >= strokes.length) {
          setIsFinished(true);
          onFinished(); // avisar al padre para mostrar botón
        } else {
          setCurrentStrokeIndex(nextIndex);
          setFeedbackColor(STROKE_COLOR);
        }
      }, 100);
    } else {
      setFeedbackColor(ERROR_COLOR);
      setTimeout(() => {
        setUserPath("");
        currentPoints.current = [];
        setFeedbackColor(STROKE_COLOR);
      }, 400);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isFinished,
    onMoveShouldSetPanResponder: () => !isFinished,

    onPanResponderGrant: (evt) => {
      if (isFinished) return;
      const { locationX, locationY } = evt.nativeEvent;

      const scale = 109 / CANVAS_SIZE;
      currentPoints.current = [
        { x: locationX * scale, y: locationY * scale },
      ];

      setUserPath(`M ${locationX} ${locationY}`);
      setFeedbackColor(STROKE_COLOR);
    },

    onPanResponderMove: (evt) => {
      if (isFinished) return;
      const { locationX, locationY } = evt.nativeEvent;

      const scale = 109 / CANVAS_SIZE;
      currentPoints.current.push({
        x: locationX * scale,
        y: locationY * scale,
      });

      setUserPath((prev) => `${prev} L ${locationX} ${locationY}`);
    },

    onPanResponderRelease: () => {
      if (isFinished) return;
      validateStroke();
    },

    onPanResponderTerminate: () => {
      if (isFinished) return;
      validateStroke();
    },
  });

  if (!strokes.length) {
    return null;
  }

  return (
    <Surface
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: 32,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      elevation={1}
    >
      <View
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
          {...panResponder.panHandlers}
        >
          <Svg width="100%" height="100%" viewBox="0 0 109 109">
            {/* Guía suave, sin marco */}
            <G opacity={0.08}>
              <Path
                d="M54.5,0 L54.5,109 M0,54.5 L109,54.5"
                stroke="#000"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </G>

            {/* Trazos ya completados */}
            {completedPaths.map((d, i) => (
              <Path
                key={i}
                d={d}
                stroke={STROKE_COLOR}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Fantasma del trazo actual */}
            {!isFinished && strokes[currentStrokeIndex] && (
              <Path
                d={strokes[currentStrokeIndex]}
                stroke="#d6d3d1"
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.4}
              />
            )}

            {/* Trazo del usuario */}
            <G transform={`scale(${109 / CANVAS_SIZE})`}>
              <Path
                d={userPath}
                stroke={feedbackColor}
                strokeWidth={(CANVAS_SIZE / 109) * 5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </G>
          </Svg>
        </View>
      </View>
    </Surface>
  );
};
