import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, PanResponder, StyleSheet, Pressable } from "react-native";
import { Surface, Text } from "react-native-paper";
import Svg, { Path, G } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";
import {
  Undo2,
  Trash2,
  Eye,
  EyeOff,
  ClipboardCheck,
  Volume2,
} from "lucide-react-native";

import { ScoreOverlay } from "./ScoreOverlay";

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

// Colores UI
const COLORS = {
  undo: "#F5A238",
  clear: "#EF4444",
  guide: "#3B82F6",
  validate: "#10B981",
  audio: "#EC4899",
};

// --- CONSTANTES DE VALIDACIÓN MEJORADAS ---
const MIN_POINTS_PER_STROKE = 10; // Reducido (antes 15)
const START_TOLERANCE = 10; // Aumentado (antes 6)
const END_TOLERANCE = 10; // Aumentado (antes 6)
const TARGET_SAMPLES = 60; // Reducido para más tolerancia (antes 80)
const USER_SAMPLES_MAX = 120; // Reducido (antes 180)
const HAUSDORFF_MAX = 10; // Aumentado (antes 6)
const MONOTONIC_MIN_RATIO = 0.75; // Reducido (antes 0.88)

// Pesos rebalanceados - menos énfasis en inicio/fin exacto
const WEIGHTS = {
  start: 0.1, // Reducido (antes 0.15)
  end: 0.1, // Reducido (antes 0.15)
  path: 0.45, // Aumentado - lo más importante es la forma (antes 0.35)
  length: 0.15, // Igual
  direction: 0.2, // Igual
};

const PASSING_SCORE = 85;

// --- HELPERS (Matemáticas para validar el trazo) ---
const downsamplePoints = (points: Point[], maxPoints: number): Point[] => {
  if (points.length <= maxPoints) return points;
  const step = points.length / maxPoints;
  const result: Point[] = [];
  for (let i = 0; i < points.length; i += step) {
    result.push(points[Math.floor(i)]);
  }
  return result;
};

// Suavizado de puntos para eliminar ruido del dedo
const smoothPoints = (points: Point[], windowSize: number = 3): Point[] => {
  if (points.length < windowSize) return points;

  const smoothed: Point[] = [];
  const half = Math.floor(windowSize / 2);

  for (let i = 0; i < points.length; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (
      let j = Math.max(0, i - half);
      j <= Math.min(points.length - 1, i + half);
      j++
    ) {
      sumX += points[j].x;
      sumY += points[j].y;
      count++;
    }

    smoothed.push({
      x: sumX / count,
      y: sumY / count,
    });
  }

  return smoothed;
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
    setFinalScore(null);
    currentPoints.current = [];
  };

  const undoLastStroke = () => {
    if (userStrokes.length > 0) {
      setUserStrokes((prev) => prev.slice(0, -1));
      setFinalScore(null);
    }
  };

  const toggleGuide = () => {
    setShowGuide((prev) => !prev);
  };

  // --- LÓGICA DE VALIDACIÓN ---
  const validateStroke = (
    userPathStr: string,
    targetPathStr: string
  ): StrokeScore | null => {
    try {
      const targetProps = new svgPathProperties(targetPathStr);
      const targetLength = targetProps.getTotalLength();
      const userPoints = pathStringToPoints(userPathStr);
      if (userPoints.length < MIN_POINTS_PER_STROKE) return null;

      const smoothedPoints = smoothPoints(userPoints, 5);

      const userLength = calculatePathLength(smoothedPoints);

      const startAccuracy = normalize(
        distance(smoothedPoints[0], targetProps.getPointAtLength(0)),
        START_TOLERANCE * 2
      );
      const endAccuracy = normalize(
        distance(
          smoothedPoints[smoothedPoints.length - 1],
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
      const sampledUser = downsamplePoints(smoothedPoints, USER_SAMPLES_MAX);

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
        let bestIdx = 0;
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
      if (onComplete) onComplete(roundedScore);
    }
  };

  // --- PAN RESPONDER ---
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

  const getScoreLabel = (score: number): string => {
    if (score >= 98) return "完璧"; // Kanpeki (Perfecto) - El objetivo final
    if (score >= 90) return "素晴らしい"; // Subarashii (Maravilloso) - Excelencia
    if (score >= 80) return "上手"; // Jouzu (Hábil) - Muy bueno
    if (score >= 70) return "上出来"; // Joudeki (Bien hecho) - Aprobado sólido
    if (score >= 60) return "良い"; // Yoi (Bueno) - Aprobado justo
    return "修行"; // Shugyou (Entrenamiento) - Reprobado
  };

  const getScoreColor = (score: number): string => {
    if (score >= 98) return "#FFD700"; // Dorado (Oro)
    if (score >= 90) return "#10B981"; // Verde Esmeralda (Éxito rotundo)
    if (score >= 80) return "#84CC16"; // Verde Lima (Buen camino)
    if (score >= 70) return "#FACC15"; // Amarillo (Advertencia positiva)
    if (score >= 60) return "#FB923C"; // Naranja (Al borde)
    return "#EF4444"; // Rojo (Fallo)
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

        {/* OVERLAY DE RESULTADO - Nueva Animación */}
        {finalScore !== null && (
          <ScoreOverlay
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
                  {
                    color: userStrokes.length > 0 ? COLORS.clear : "#D1D5DB",
                  },
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

// --- ESTILOS LIMPIOS ---
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  writingCard: {
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    // overflow: "hidden", // <--- ELIMINADO para que las hojas y efectos salgan del borde
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: CARD_PADDING,
    // Aseguramos que el canvas no se salga, pero el overlay sí pueda
    overflow: "hidden",
    borderRadius: 32,
  },
  controlsGrid: {
    gap: 10,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonCard: {
    height: 90,
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
  audioButton: {
    height: 90,
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
