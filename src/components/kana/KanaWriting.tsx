import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, PanResponder, StyleSheet, Pressable } from "react-native";
import { Surface, Text } from "react-native-paper";
import Svg, { Path, G } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import {
  Undo2,
  Trash2,
  Eye,
  EyeOff,
  ClipboardCheck,
  Volume2,
} from "lucide-react-native";

// --- TIPOS ---
type KanaWritingProps = {
  strokes: string[];
  size: number;
  strokeWidth?: number;
  onComplete?: (score: number) => void;
  onPlayAudio?: () => void;
  hasAudio?: boolean;
  isPlayingAudio?: boolean;
};

type Point = { x: number; y: number };

type StrokeScore = {
  startAccuracy: number;
  endAccuracy: number;
  pathAccuracy: number;
  lengthAccuracy: number;
  directionAccuracy: number;
  total: number;
};

// --- CONSTANTES DE DISEÑO ---
const GUIDELINE_COLOR = "#e5e5e5";
const STROKE_COLOR = "#1c1917";
const DEFAULT_STROKE_WIDTH = 6;
const CANVAS_VIEWBOX = 109;
const CARD_PADDING = 20;

// Colores
const COLORS = {
  undo: "#F5A238",
  clear: "#EF4444",
  guide: "#3B82F6",
  validate: "#10B981",
  audio: "#EC4899",
};

// --- CONSTANTES DE VALIDACIÓN ---
const MIN_POINTS_PER_STROKE = 15;
const START_TOLERANCE = 6;
const END_TOLERANCE = 6;
const TARGET_SAMPLES = 80;
const USER_SAMPLES_MAX = 180;
const HAUSDORFF_MAX = 6;
const MONOTONIC_MIN_RATIO = 0.88;

const WEIGHTS = {
  start: 0.15,
  end: 0.15,
  path: 0.35,
  length: 0.15,
  direction: 0.2,
};

const PASSING_SCORE = 85;

// --- HELPERS ---
const downsamplePoints = (points: Point[], maxPoints: number): Point[] => {
  if (points.length <= maxPoints) return points;
  const step = points.length / maxPoints;
  const result: Point[] = [];
  for (let i = 0; i < points.length; i += step) {
    result.push(points[Math.floor(i)]);
  }
  return result;
};

const pathStringToPoints = (pathStr: string): Point[] => {
  const points: Point[] = [];
  const commands = pathStr.match(/[ML]\s*[\d.]+\s*[\d.]+/g);
  if (!commands) return points;
  for (const cmd of commands) {
    const nums = cmd.match(/[\d.]+/g);
    if (nums && nums.length >= 2) {
      points.push({ x: parseFloat(nums[0]), y: parseFloat(nums[1]) });
    }
  }
  return points;
};

const calculatePathLength = (points: Point[]): number => {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    length += Math.hypot(dx, dy);
  }
  return length;
};

const distance = (p1: Point, p2: Point): number => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
};

const normalize = (value: number, maxBad: number): number => {
  return Math.max(0, Math.min(100, 100 - (value / maxBad) * 100));
};

// --- COMPONENTE SCORE RESULT (SINCRONIZADO) ---
const ScoreResult = ({
  score,
  label,
  color,
  onRetry,
}: {
  score: number;
  label: string;
  color: string;
  onRetry: () => void;
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Valores de animación
  const bgOpacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  // Animaciones de la Onda (Shockwave)
  // CAMBIO 1: Empieza en 1.5 (YA FUERA del número) para evitar colisión visual
  const waveScale = useSharedValue(1.5);
  const waveOpacity = useSharedValue(0);
  const waveWidth = useSharedValue(5);

  useEffect(() => {
    // A. Fondo
    bgOpacity.value = withTiming(1, { duration: 250 });

    // B. Número (El "Martillo")
    scale.value = withSequence(
      withTiming(1.3, { duration: 300, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 12, stiffness: 120 })
    );

    // C. La Onda (El "Impacto")
    // CAMBIO 2: Delay de 250ms para asegurar que el número ya "aterrizó"
    const WAVE_DELAY = 250;
    const WAVE_DURATION = 1500;

    // Expansión: Sale de 1.5 a 3.0 (Halo grande)
    waveScale.value = withDelay(
      WAVE_DELAY,
      withTiming(3.0, {
        duration: WAVE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Opacidad: Aparece solo cuando ya es seguro (WAVE_DELAY)
    waveOpacity.value = withDelay(
      WAVE_DELAY,
      withSequence(
        withTiming(1, { duration: 50 }), // Flash visible rápido
        withTiming(0, { duration: WAVE_DURATION - 50 }) // Fade out lento
      )
    );

    // Grosor: Se disipa
    waveWidth.value = withDelay(
      WAVE_DELAY,
      withTiming(0, {
        duration: WAVE_DURATION,
        easing: Easing.out(Easing.quad),
      })
    );

    // D. Contador
    let start = 0;
    const duration = 1000;
    const startTime = Date.now();

    const animateCounter = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const current = Math.round(start + (score - start) * progress);
      setDisplayScore(current);
      if (progress < 1) requestAnimationFrame(animateCounter);
    };
    requestAnimationFrame(animateCounter);
  }, [score]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale.value }],
    opacity: waveOpacity.value,
    borderWidth: waveWidth.value,
    borderColor: color,
  }));

  return (
    // CAMBIO 3: Arreglado el problema de zIndex en Pressable
    <Pressable
      onPress={onRetry}
      style={[StyleSheet.absoluteFill, { zIndex: 100 }]}
    >
      <Animated.View style={[styles.cleanOverlay, containerStyle]}>
        <View style={styles.centeredContent}>
          {/* Onda expansiva - Detrás del número */}
          <Animated.View style={[styles.cleanWave, waveStyle]} />

          {/* Texto - Encima de la onda */}
          <Animated.View style={[styles.scoreGroup, contentStyle]}>
            <Text style={[styles.cleanScoreText, { color }]}>
              {displayScore}
              <Text style={[styles.cleanUnitText, { color }]}>点</Text>
            </Text>

            <Text style={[styles.cleanLabelText, { color }]}>{label}</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const KanaWriting = ({
  strokes,
  size,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  onComplete,
  onPlayAudio,
  hasAudio = false,
  isPlayingAudio = false,
}: KanaWritingProps) => {
  const [userStrokes, setUserStrokes] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [showGuide, setShowGuide] = useState(true);
  const [validationResult, setValidationResult] = useState<
    "success" | "error" | null
  >(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_VIEWBOX,
    height: CANVAS_VIEWBOX,
  });

  const currentPoints = useRef<Point[]>([]);
  const currentStrokeIndex = userStrokes.length;
  const isFinished = finalScore !== null;
  const canValidate = userStrokes.length === strokes.length;
  const innerTargetSize = size - CARD_PADDING * 2;

  useEffect(() => {
    resetAll();
  }, [strokes]);

  const resetAll = () => {
    setUserStrokes([]);
    setCurrentPath("");
    setStrokeColor(STROKE_COLOR);
    setValidationResult(null);
    setFinalScore(null);
    currentPoints.current = [];
  };

  const undoLastStroke = () => {
    if (userStrokes.length > 0) {
      setUserStrokes((prev) => prev.slice(0, -1));
      setValidationResult(null);
      setFinalScore(null);
    }
  };

  const toggleGuide = () => {
    setShowGuide((prev) => !prev);
  };

  const validateStroke = (
    userPathStr: string,
    targetPathStr: string
  ): StrokeScore | null => {
    try {
      const targetProps = new svgPathProperties(targetPathStr);
      const targetLength = targetProps.getTotalLength();
      const userPoints = pathStringToPoints(userPathStr);
      if (userPoints.length < MIN_POINTS_PER_STROKE) return null;

      const userLength = calculatePathLength(userPoints);

      const startAccuracy = normalize(
        distance(userPoints[0], targetProps.getPointAtLength(0)),
        START_TOLERANCE * 2
      );
      const endAccuracy = normalize(
        distance(
          userPoints[userPoints.length - 1],
          targetProps.getPointAtLength(targetLength)
        ),
        END_TOLERANCE * 2
      );
      const lengthAccuracy = normalize(
        Math.abs(1 - userLength / targetLength),
        0.3
      );

      const targetSamples: Point[] = [];
      for (let i = 0; i <= TARGET_SAMPLES; i++) {
        const p = targetProps.getPointAtLength(
          (targetLength * i) / TARGET_SAMPLES
        );
        targetSamples.push({ x: p.x, y: p.y });
      }
      const sampledUser = downsamplePoints(userPoints, USER_SAMPLES_MAX);

      let maxDistUserToTarget = 0;
      const nearestIndices: number[] = [];

      for (const up of sampledUser) {
        let minDist = Infinity;
        let bestIdx = 0;
        for (let j = 0; j < targetSamples.length; j++) {
          const d = distance(up, targetSamples[j]);
          if (d < minDist) {
            minDist = d;
            bestIdx = j;
          }
        }
        maxDistUserToTarget = Math.max(maxDistUserToTarget, minDist);
        nearestIndices.push(bestIdx);
      }

      let maxDistTargetToUser = 0;
      for (const tp of targetSamples) {
        let minDist = Infinity;
        for (const up of sampledUser) {
          const d = distance(up, tp);
          if (d < minDist) minDist = d;
        }
        maxDistTargetToUser = Math.max(maxDistTargetToUser, minDist);
      }
      const pathAccuracy = normalize(
        Math.max(maxDistUserToTarget, maxDistTargetToUser),
        HAUSDORFF_MAX * 2
      );

      let forwardSteps = 0;
      for (let i = 1; i < nearestIndices.length; i++) {
        if (nearestIndices[i] >= nearestIndices[i - 1]) forwardSteps++;
      }
      const directionAccuracy = normalize(
        1 - forwardSteps / (nearestIndices.length - 1 || 1),
        1 - MONOTONIC_MIN_RATIO
      );

      const total =
        startAccuracy * WEIGHTS.start +
        endAccuracy * WEIGHTS.end +
        pathAccuracy * WEIGHTS.path +
        lengthAccuracy * WEIGHTS.length +
        directionAccuracy * WEIGHTS.direction;

      return {
        startAccuracy,
        endAccuracy,
        pathAccuracy,
        lengthAccuracy,
        directionAccuracy,
        total,
      };
    } catch {
      return null;
    }
  };

  const validateDrawing = () => {
    if (!canValidate) return;
    let totalScore = 0;
    let validCount = 0;

    for (let i = 0; i < strokes.length; i++) {
      const score = validateStroke(userStrokes[i], strokes[i]);
      if (score) {
        totalScore += score.total;
        validCount++;
      }
    }

    const averageScore = validCount > 0 ? totalScore / strokes.length : 0;
    const roundedScore = Math.round(averageScore);
    setFinalScore(roundedScore);

    if (roundedScore >= PASSING_SCORE) {
      setValidationResult("success");
      if (onComplete) onComplete(roundedScore);
    } else {
      setValidationResult("error");
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () =>
          !isFinished && currentStrokeIndex < strokes.length,
        onMoveShouldSetPanResponder: () =>
          !isFinished && currentStrokeIndex < strokes.length,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          const scaleX = CANVAS_VIEWBOX / canvasSize.width;
          const scaleY = CANVAS_VIEWBOX / canvasSize.height;
          const x = locationX * scaleX;
          const y = locationY * scaleY;
          currentPoints.current = [{ x, y }];
          setCurrentPath(`M ${x} ${y}`);
          setStrokeColor(STROKE_COLOR);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          const scaleX = CANVAS_VIEWBOX / canvasSize.width;
          const scaleY = CANVAS_VIEWBOX / canvasSize.height;
          const x = locationX * scaleX;
          const y = locationY * scaleY;
          currentPoints.current.push({ x, y });
          setCurrentPath((prev) => `${prev} L ${x} ${y}`);
        },
        onPanResponderRelease: () => {
          if (
            currentPath &&
            currentPoints.current.length >= MIN_POINTS_PER_STROKE
          ) {
            setUserStrokes((prev) => [...prev, currentPath]);
          }
          setCurrentPath("");
          currentPoints.current = [];
        },
      }),
    [canvasSize, isFinished, currentStrokeIndex, strokes.length, currentPath]
  );

  if (!strokes || strokes.length === 0) return null;

  const GAP = 12;
  const buttonCardSize = (size - GAP) / 2;

  const getScoreColor = (score: number): string => {
    if (score >= 95) return "#10B981"; // Verde intenso
    if (score >= 85) return "#84CC16"; // Verde lima
    if (score >= 65) return "#F97316"; // Naranja
    return "#EF4444"; // Rojo
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 95) return "完璧!";
    if (score >= 85) return "合格!";
    if (score >= 65) return "惜しい!";
    return "練習しよう";
  };

  return (
    <View style={styles.container}>
      {/* TARJETA DE ESCRITURA */}
      <Surface
        style={[styles.writingCard, { width: size, height: size }]}
        elevation={1}
        mode="flat"
      >
        <View style={styles.canvasContainer}>
          <View
            style={{ width: innerTargetSize, height: innerTargetSize }}
            onLayout={(e) => setCanvasSize(e.nativeEvent.layout)}
            {...panResponder.panHandlers}
          >
            <Svg width="100%" height="100%" viewBox="0 0 109 109">
              <G opacity={0.1}>
                <Path
                  d="M54.5,0 L54.5,109 M0,54.5 L109,54.5"
                  stroke="#000"
                  strokeDasharray="4,4"
                />
              </G>
              {showGuide && (
                <G opacity={0.25}>
                  {strokes.map((d, i) => (
                    <Path
                      key={`guide-${i}`}
                      d={d}
                      stroke={GUIDELINE_COLOR}
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </G>
              )}
              {userStrokes.map((d, i) => (
                <Path
                  key={`user-${i}`}
                  d={d}
                  stroke={STROKE_COLOR}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {currentPath && (
                <Path
                  d={currentPath}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.9}
                />
              )}
            </Svg>
          </View>
        </View>

        {/* OVERLAY DE RESULTADO */}
        {finalScore !== null && (
          <ScoreResult
            score={finalScore}
            label={getScoreLabel(finalScore)}
            color={getScoreColor(finalScore)}
            onRetry={resetAll}
          />
        )}
      </Surface>

      {/* CONTROLES */}
      <View style={[styles.controlsGrid, { width: size }]}>
        <View style={styles.controlsRow}>
          <Surface
            style={[styles.buttonCard, { width: buttonCardSize }]}
            mode="flat"
          >
            <Pressable
              onPress={undoLastStroke}
              disabled={userStrokes.length === 0}
              style={[
                styles.buttonPressable,
                userStrokes.length === 0 && styles.buttonDisabled,
              ]}
            >
              <Undo2
                size={28}
                color={userStrokes.length > 0 ? COLORS.undo : "#D1D5DB"}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.buttonText,
                  { color: userStrokes.length > 0 ? COLORS.undo : "#D1D5DB" },
                ]}
              >
                戻す
              </Text>
            </Pressable>
          </Surface>
          <Surface
            style={[styles.buttonCard, { width: buttonCardSize }]}
            mode="flat"
          >
            <Pressable
              onPress={resetAll}
              disabled={userStrokes.length === 0}
              style={[
                styles.buttonPressable,
                userStrokes.length === 0 && styles.buttonDisabled,
              ]}
            >
              <Trash2
                size={28}
                color={userStrokes.length > 0 ? COLORS.clear : "#D1D5DB"}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.buttonText,
                  { color: userStrokes.length > 0 ? COLORS.clear : "#D1D5DB" },
                ]}
              >
                消す
              </Text>
            </Pressable>
          </Surface>
        </View>

        <View style={styles.controlsRow}>
          <Surface
            style={[
              styles.buttonCard,
              { width: buttonCardSize },
              !showGuide && { backgroundColor: COLORS.guide },
            ]}
            mode="flat"
          >
            <Pressable onPress={toggleGuide} style={styles.buttonPressable}>
              {showGuide ? (
                <Eye size={28} color={COLORS.guide} strokeWidth={2.5} />
              ) : (
                <EyeOff size={28} color="#FFFFFF" strokeWidth={2.5} />
              )}
              <Text
                style={[
                  styles.buttonText,
                  { color: showGuide ? COLORS.guide : "#FFFFFF" },
                ]}
              >
                {showGuide ? "ガイド" : "非表示"}
              </Text>
            </Pressable>
          </Surface>
          <Surface
            style={[styles.buttonCard, { width: buttonCardSize }]}
            mode="flat"
          >
            <Pressable onPress={validateDrawing} style={styles.buttonPressable}>
              <ClipboardCheck
                size={28}
                color={COLORS.validate}
                strokeWidth={2.5}
              />
              <Text style={[styles.buttonText, { color: COLORS.validate }]}>
                採点
              </Text>
            </Pressable>
          </Surface>
        </View>

        {hasAudio && (
          <Surface
            style={[
              styles.audioButton,
              { width: size },
              isPlayingAudio && { backgroundColor: COLORS.audio },
            ]}
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

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  writingCard: {
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: CARD_PADDING,
  },
  controlsGrid: {
    gap: 12,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonCard: {
    height: 88,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 15,
    includeFontPadding: false,
  },
  // --- ESTILOS DE RESULTADO (LIMPIO Y CENTRADO) ---
  cleanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.96)", // Fondo blanco casi solido
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    width: 200, // Contenedor fijo para alinear onda y texto
    height: 200,
    position: "relative",
  },
  cleanWave: {
    position: "absolute",
    width: 160, // Aumentado ligeramente para mayor seguridad visual
    height: 160,
    borderRadius: 80,
    zIndex: 0,
  },
  scoreGroup: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  cleanScoreText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 88,
    lineHeight: 100,
    includeFontPadding: false,
    textAlign: "center",
  },
  cleanUnitText: {
    fontSize: 24,
    fontWeight: "600",
  },
  cleanLabelText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 24,
    marginTop: -5,
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  // ---
  audioButton: {
    height: 64,
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
