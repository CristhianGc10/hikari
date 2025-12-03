// src/components/kana/KanaAnimation.tsx
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import Svg, { Path, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { svgPathProperties } from "svg-path-properties";
import {
  RotateCcw,
  Gauge,
  StepForward,
  Palette,
  Volume2,
} from "lucide-react-native";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const STROKE_COLOR = "#1c1917";
const GUIDELINE_COLOR = "#e5e5e5";
const CARD_PADDING = 20;
const DEFAULT_STROKE_WIDTH = 6;

// Colores de los botones
const COLORS = {
  replay: "#F5A238",
  speed: "#3B82F6",
  stepByStep: "#10B981",
  palette: "#8B5CF6",
  audio: "#EC4899",
};

// Colores para cada trazo
const STROKE_COLORS = [
  "#E53935",
  "#FB8C00",
  "#FDD835",
  "#43A047",
  "#1E88E5",
  "#8E24AA",
  "#F06292",
  "#00ACC1",
  "#6D4C41",
  "#546E7A",
];

// Velocidades disponibles
const SPEEDS = [
  { label: "0.5x", duration: 1600, delay: 1800 },
  { label: "1x", duration: 800, delay: 900 },
  { label: "1.5x", duration: 533, delay: 600 },
  { label: "2x", duration: 400, delay: 450 },
];

type KanaAnimationProps = {
  strokes: string[];
  size: number;
  strokeWidth?: number;
  onPlayAudio?: () => void;
  hasAudio?: boolean;
  isPlayingAudio?: boolean;
};

export const KanaAnimation = ({
  strokes,
  size,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  onPlayAudio,
  hasAudio = false,
  isPlayingAudio = false,
}: KanaAnimationProps) => {
  // Estados
  const [animationKey, setAnimationKey] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [isStepMode, setIsStepMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isColorMode, setIsColorMode] = useState(false);

  const currentSpeed = SPEEDS[speedIndex];
  const totalStrokes = strokes.length;

  // Handlers
  const onReplay = () => {
    setStepIndex(0);
    setAnimationKey((prev) => prev + 1);
  };

  const onSpeedPress = () => {
    setSpeedIndex((prev) => (prev + 1) % SPEEDS.length);
  };

  const onStepPress = () => {
    if (!isStepMode) {
      // Activar modo paso a paso
      setIsStepMode(true);
      setStepIndex(0);
      setAnimationKey((prev) => prev + 1);
    } else {
      // Avanzar al siguiente paso
      if (stepIndex < totalStrokes - 1) {
        setStepIndex((prev) => prev + 1);
      } else {
        // Último trazo completado: desactivar modo paso a paso
        setIsStepMode(false);
        setStepIndex(0);
      }
    }
  };

  const onStepLongPress = () => {
    if (isStepMode) {
      setIsStepMode(false);
      setStepIndex(0);
      setAnimationKey((prev) => prev + 1);
    }
  };

  const onColorPress = () => {
    setIsColorMode((prev) => !prev);
  };

  const getStrokeColor = (index: number) => {
    return isColorMode
      ? STROKE_COLORS[index % STROKE_COLORS.length]
      : STROKE_COLOR;
  };

  if (!strokes || strokes.length === 0) return null;

  // Dimensiones
  const GAP = 12;
  const buttonCardSize = (size - GAP) / 2;

  return (
    <View style={styles.container}>
      {/* Tarjeta de animación SVG */}
      <Surface
        style={[styles.svgCard, { width: size, height: size }]}
        elevation={1}
        mode="flat"
      >
        <View style={styles.svgInner}>
          <Svg width="100%" height="100%" viewBox="0 0 109 109">
            {/* Guías */}
            <G opacity={0.1}>
              <Path
                d="M54.5,0 L54.5,109 M0,54.5 L109,54.5"
                stroke="#000"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            </G>

            {/* Trazos de fondo */}
            <G>
              {strokes.map((d, i) => (
                <Path
                  key={`bg-${i}`}
                  d={d}
                  stroke={GUIDELINE_COLOR}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </G>

            {/* Trazos animados */}
            <G key={animationKey}>
              {isStepMode
                ? strokes
                    .slice(0, stepIndex + 1)
                    .map((d, i) => (
                      <StrokeAnimated
                        key={`s-${animationKey}-${i}`}
                        d={d}
                        color={getStrokeColor(i)}
                        strokeWidth={strokeWidth}
                        duration={currentSpeed.duration}
                        delayMs={0}
                        showImmediately={i < stepIndex}
                      />
                    ))
                : strokes.map((d, i) => (
                    <StrokeAnimated
                      key={`a-${animationKey}-${i}`}
                      d={d}
                      color={getStrokeColor(i)}
                      strokeWidth={strokeWidth}
                      duration={currentSpeed.duration}
                      delayMs={i * currentSpeed.delay}
                      showImmediately={false}
                    />
                  ))}
            </G>
          </Svg>
        </View>
      </Surface>

      {/* Grid de 4 tarjetas de control */}
      <View style={[styles.controlsGrid, { width: size }]}>
        {/* Fila 1 */}
        <View style={styles.controlsRow}>
          {/* Tarjeta 1: Repetir */}
          <Surface
            style={[styles.buttonCard, { width: buttonCardSize }]}
            elevation={1}
            mode="flat"
          >
            <Pressable onPress={onReplay} style={styles.buttonPressable}>
              <RotateCcw size={28} color={COLORS.replay} strokeWidth={2.5} />
              <Text style={[styles.buttonText, { color: COLORS.replay }]}>
                もう一度
              </Text>
            </Pressable>
          </Surface>

          {/* Tarjeta 2: Velocidad */}
          <Surface
            style={[styles.buttonCard, { width: buttonCardSize }]}
            elevation={1}
            mode="flat"
          >
            <Pressable onPress={onSpeedPress} style={styles.buttonPressable}>
              <Gauge size={28} color={COLORS.speed} strokeWidth={2.5} />
              <Text style={[styles.buttonText, { color: COLORS.speed }]}>
                {currentSpeed.label}
              </Text>
            </Pressable>
          </Surface>
        </View>

        {/* Fila 2 */}
        <View style={styles.controlsRow}>
          {/* Tarjeta 3: Paso a paso */}
          <Surface
            style={[
              styles.buttonCard,
              { width: buttonCardSize },
              isStepMode && { backgroundColor: COLORS.stepByStep },
            ]}
            elevation={1}
            mode="flat"
          >
            <Pressable
              onPress={onStepPress}
              onLongPress={onStepLongPress}
              style={styles.buttonPressable}
            >
              <StepForward
                size={28}
                color={isStepMode ? "#FFFFFF" : COLORS.stepByStep}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.buttonText,
                  { color: isStepMode ? "#FFFFFF" : COLORS.stepByStep },
                ]}
              >
                {isStepMode ? `${stepIndex + 1} / ${totalStrokes}` : "順番"}
              </Text>
            </Pressable>
          </Surface>

          {/* Tarjeta 4: Colores */}
          <Surface
            style={[
              styles.buttonCard,
              { width: buttonCardSize },
              isColorMode && { backgroundColor: COLORS.palette },
            ]}
            elevation={1}
            mode="flat"
          >
            <Pressable onPress={onColorPress} style={styles.buttonPressable}>
              <Palette
                size={28}
                color={isColorMode ? "#FFFFFF" : COLORS.palette}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.buttonText,
                  { color: isColorMode ? "#FFFFFF" : COLORS.palette },
                ]}
              >
                {isColorMode ? "オン" : "色分け"}
              </Text>
            </Pressable>
          </Surface>
        </View>

        {/* Botón de Audio - Ancho completo */}
        {hasAudio && (
          <Surface
            style={[
              styles.audioButton,
              { width: size },
              isPlayingAudio && { backgroundColor: COLORS.audio },
            ]}
            elevation={1}
            mode="flat"
          >
            <Pressable
              onPress={onPlayAudio}
              disabled={isPlayingAudio}
              style={styles.audioButtonPressable}
            >
              <Volume2
                size={28}
                color={isPlayingAudio ? "#FFFFFF" : COLORS.audio}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.audioButtonText,
                  { color: isPlayingAudio ? "#FFFFFF" : COLORS.audio },
                ]}
              >
                {isPlayingAudio ? "再生中..." : "発音を聞く"}
              </Text>
            </Pressable>
          </Surface>
        )}
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  svgCard: {
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  svgInner: {
    flex: 1,
    padding: CARD_PADDING,
  },
  controlsGrid: {
    gap: 10,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonCard: {
    height: 85,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  buttonPressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 15,
    includeFontPadding: false,
  },
  audioButton: {
    height: 85,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  audioButtonPressable: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  audioButtonText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 18,
    includeFontPadding: false,
  },
});

// Componente de trazo animado
type StrokeAnimatedProps = {
  d: string;
  color: string;
  strokeWidth: number;
  duration: number;
  delayMs: number;
  showImmediately: boolean;
};

const StrokeAnimated = ({
  d,
  color,
  strokeWidth,
  duration,
  delayMs,
  showImmediately,
}: StrokeAnimatedProps) => {
  const progress = useSharedValue(showImmediately ? 1 : 0);

  const pathLength = useMemo(() => {
    try {
      return new svgPathProperties(d).getTotalLength();
    } catch {
      return 300;
    }
  }, [d]);

  useEffect(() => {
    if (showImmediately) {
      progress.value = 1;
      return;
    }

    progress.value = 0;

    const timer = setTimeout(() => {
      progress.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    }, delayMs + 100);

    return () => {
      clearTimeout(timer);
      cancelAnimation(progress);
    };
  }, [d, duration, delayMs, showImmediately]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
    opacity: progress.value === 0 ? 0 : 1,
  }));

  return (
    <AnimatedPath
      d={d}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={[pathLength, pathLength]}
      animatedProps={animatedProps}
    />
  );
};
