// src/components/kana/KanaWriting.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, PanResponder, StyleSheet, Pressable } from "react-native";
import { Surface, Text } from "react-native-paper";
import Svg, { Path, G } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";
import { Undo2, Trash2, Eye, EyeOff, ClipboardCheck } from "lucide-react-native";

type KanaWritingProps = {
  strokes: string[];
  size: number;
  strokeWidth?: number; // Grosor de trazo opcional (para caracteres combinados)
  onComplete?: (score: number) => void;
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

// Colores de botones
const COLORS = {
  undo: "#F5A238",
  clear: "#EF4444",
  guide: "#3B82F6",
  validate: "#10B981",
};

// --- CONSTANTES DE VALIDACIÓN (Alta precisión 90-95%) ---
const MIN_POINTS_PER_STROKE = 15;
const START_TOLERANCE = 6;
const END_TOLERANCE = 6;
const LENGTH_MIN_RATIO = 0.85;
const LENGTH_MAX_RATIO = 1.15;
const TARGET_SAMPLES = 80;
const USER_SAMPLES_MAX = 180;
const HAUSDORFF_MAX = 6;
const MONOTONIC_MIN_RATIO = 0.88;

// Pesos para el puntaje
const WEIGHTS = {
  start: 0.15,
  end: 0.15,
  path: 0.35,
  length: 0.15,
  direction: 0.20,
};

// Umbral de aprobación
const PASSING_SCORE = 85;

// --- HELPERS ---
const downsamplePoints = (points: Point[], maxPoints: number): Point[] => {
  if (points.length <= maxPoints) return points;
  const result: Point[] = [];
  const step = points.length / maxPoints;
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

export const KanaWriting = ({ strokes, size, strokeWidth = DEFAULT_STROKE_WIDTH, onComplete }: KanaWritingProps) => {
  const [userStrokes, setUserStrokes] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [showGuide, setShowGuide] = useState(true);
  const [validationResult, setValidationResult] = useState<"success" | "error" | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: CANVAS_VIEWBOX, height: CANVAS_VIEWBOX });

  const currentPoints = useRef<Point[]>([]);
  const currentStrokeIndex = userStrokes.length;
  const isFinished = validationResult === "success";
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
      setUserStrokes(prev => prev.slice(0, -1));
      setValidationResult(null);
      setFinalScore(null);
    }
  };

  const toggleGuide = () => {
    setShowGuide(prev => !prev);
  };

  // --- VALIDACIÓN AVANZADA ---
  const validateStroke = (userPathStr: string, targetPathStr: string): StrokeScore | null => {
    try {
      const targetProps = new svgPathProperties(targetPathStr);
      const targetLength = targetProps.getTotalLength();

      const userPoints = pathStringToPoints(userPathStr);
      if (userPoints.length < MIN_POINTS_PER_STROKE) {
        return null;
      }

      const userLength = calculatePathLength(userPoints);

      // 1. Precisión del punto de inicio
      const startTarget = targetProps.getPointAtLength(0);
      const startUser = userPoints[0];
      const startDist = distance(startUser, startTarget);
      const startAccuracy = normalize(startDist, START_TOLERANCE * 2);

      // 2. Precisión del punto final
      const endTarget = targetProps.getPointAtLength(targetLength);
      const endUser = userPoints[userPoints.length - 1];
      const endDist = distance(endUser, endTarget);
      const endAccuracy = normalize(endDist, END_TOLERANCE * 2);

      // 3. Precisión de la longitud
      const lengthRatio = userLength / targetLength;
      const lengthDeviation = Math.abs(1 - lengthRatio);
      const lengthAccuracy = normalize(lengthDeviation, 0.3);

      // 4. Muestrear la guía objetivo
      const targetSamples: Point[] = [];
      for (let i = 0; i <= TARGET_SAMPLES; i++) {
        const p = targetProps.getPointAtLength((targetLength * i) / TARGET_SAMPLES);
        targetSamples.push({ x: p.x, y: p.y });
      }

      const sampledUser = downsamplePoints(userPoints, USER_SAMPLES_MAX);

      // 5. Distancia Hausdorff bidireccional
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

      const hausdorff = Math.max(maxDistUserToTarget, maxDistTargetToUser);
      const pathAccuracy = normalize(hausdorff, HAUSDORFF_MAX * 2);

      // 6. Monotonicidad
      let forwardSteps = 0;
      for (let i = 1; i < nearestIndices.length; i++) {
        if (nearestIndices[i] >= nearestIndices[i - 1]) {
          forwardSteps++;
        }
      }
      const monotonicRatio = forwardSteps / (nearestIndices.length - 1 || 1);
      const directionAccuracy = normalize(1 - monotonicRatio, 1 - MONOTONIC_MIN_RATIO);

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
      setTimeout(() => {
        setValidationResult(null);
        setFinalScore(null);
      }, 1500);
    }
  };

  // PanResponder para dibujar
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !isFinished && currentStrokeIndex < strokes.length,
    onMoveShouldSetPanResponder: () => !isFinished && currentStrokeIndex < strokes.length,

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
      setCurrentPath(prev => `${prev} L ${x} ${y}`);
    },

    onPanResponderRelease: () => {
      if (currentPath && currentPoints.current.length >= MIN_POINTS_PER_STROKE) {
        setUserStrokes(prev => [...prev, currentPath]);
      }
      setCurrentPath("");
      currentPoints.current = [];
    },
  }), [canvasSize, isFinished, currentStrokeIndex, strokes.length, currentPath]);

  if (!strokes || strokes.length === 0) return null;

  const GAP = 12;
  const buttonCardSize = (size - GAP) / 2;

  // Color del puntaje según el resultado
  const getScoreColor = (score: number): string => {
    if (score >= 95) return "#10B981"; // Verde - Perfecto
    if (score >= 90) return "#22C55E"; // Verde claro - Excelente
    if (score >= 85) return "#84CC16"; // Lima - Muy bien (aprobado)
    if (score >= 75) return "#F5A238"; // Naranja - Bien
    if (score >= 65) return "#F97316"; // Naranja oscuro - Regular
    return "#EF4444"; // Rojo - Necesita práctica
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 95) return "完璧!"; // Perfecto
    if (score >= 90) return "素晴らしい!"; // Excelente
    if (score >= 85) return "合格!"; // Aprobado
    if (score >= 75) return "もう少し!"; // Un poco más
    if (score >= 65) return "頑張って!"; // Sigue intentando
    return "練習しよう!"; // Practiquemos
  };

  return (
    <View style={styles.container}>
      {/* Área de escritura */}
      <Surface style={[styles.writingCard, { width: size, height: size }]} elevation={1} mode="flat">
        <View style={styles.canvasContainer}>
          <View
            style={{ width: innerTargetSize, height: innerTargetSize }}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setCanvasSize({ width, height });
            }}
            {...panResponder.panHandlers}
          >
            <Svg width="100%" height="100%" viewBox="0 0 109 109">
              {/* Guías de fondo */}
              <G opacity={0.1}>
                <Path
                  d="M54.5,0 L54.5,109 M0,54.5 L109,54.5"
                  stroke="#000"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              </G>

              {/* Guía del kana */}
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

              {/* Trazos completados del usuario */}
              {userStrokes.map((d, i) => (
                <Path
                  key={`user-${i}`}
                  d={d}
                  stroke={
                    validationResult === "success"
                      ? COLORS.validate
                      : validationResult === "error"
                      ? COLORS.clear
                      : STROKE_COLOR
                  }
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Trazo actual */}
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

        {/* Overlay de éxito con puntaje */}
        {validationResult === "success" && finalScore !== null && (
          <View style={styles.successOverlay}>
            <Text style={[styles.scoreText, { color: getScoreColor(finalScore) }]}>
              {finalScore}点
            </Text>
            <Text style={[styles.scoreLabelText, { color: getScoreColor(finalScore) }]}>
              {getScoreLabel(finalScore)}
            </Text>
            <Pressable onPress={resetAll} style={[styles.retryButton, { backgroundColor: getScoreColor(finalScore) }]}>
              <Text style={styles.retryButtonText}>もう一度</Text>
            </Pressable>
          </View>
        )}

        {/* Overlay de error con puntaje */}
        {validationResult === "error" && finalScore !== null && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorScoreText}>{finalScore}点</Text>
            <Text style={styles.errorText}>{getScoreLabel(finalScore)}</Text>
          </View>
        )}
      </Surface>

      {/* Panel de controles - Grid 2x2 */}
      <View style={[styles.controlsGrid, { width: size }]}>
        {/* Fila 1 */}
        <View style={styles.controlsRow}>
          {/* Tarjeta 1: Deshacer */}
          <Surface style={[styles.buttonCard, { width: buttonCardSize }]} elevation={1} mode="flat">
            <Pressable
              onPress={undoLastStroke}
              style={[styles.buttonPressable, userStrokes.length === 0 && styles.buttonDisabled]}
              disabled={userStrokes.length === 0}
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

          {/* Tarjeta 2: Borrar todo */}
          <Surface style={[styles.buttonCard, { width: buttonCardSize }]} elevation={1} mode="flat">
            <Pressable
              onPress={resetAll}
              style={[styles.buttonPressable, userStrokes.length === 0 && styles.buttonDisabled]}
              disabled={userStrokes.length === 0}
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

        {/* Fila 2 */}
        <View style={styles.controlsRow}>
          {/* Tarjeta 3: Mostrar/Ocultar guía - Invertido */}
          <Surface
            style={[
              styles.buttonCard,
              { width: buttonCardSize },
              !showGuide && { backgroundColor: COLORS.guide },
            ]}
            elevation={1}
            mode="flat"
          >
            <Pressable onPress={toggleGuide} style={styles.buttonPressable}>
              {showGuide ? (
                <Eye size={28} color={COLORS.guide} strokeWidth={2.5} />
              ) : (
                <EyeOff size={28} color="#FFFFFF" strokeWidth={2.5} />
              )}
              <Text
                style={[styles.buttonText, { color: showGuide ? COLORS.guide : "#FFFFFF" }]}
              >
                {showGuide ? "ガイド" : "非表示"}
              </Text>
            </Pressable>
          </Surface>

          {/* Tarjeta 4: Revisar */}
          <Surface
            style={[styles.buttonCard, { width: buttonCardSize }]}
            elevation={1}
            mode="flat"
          >
            <Pressable
              onPress={validateDrawing}
              style={styles.buttonPressable}
            >
              <ClipboardCheck
                size={28}
                color={COLORS.validate}
                strokeWidth={2.5}
              />
              <Text
                style={[styles.buttonText, { color: COLORS.validate }]}
              >
                採点
              </Text>
            </Pressable>
          </Surface>
        </View>
      </View>
    </View>
  );
};

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
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  scoreText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 56,
    includeFontPadding: false,
  },
  scoreLabelText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 22,
    includeFontPadding: false,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  retryButtonText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(239, 68, 68, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  errorScoreText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 48,
    color: "#FFFFFF",
    includeFontPadding: false,
  },
  errorText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
  },
});