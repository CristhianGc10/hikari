import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, PanResponder, StyleSheet } from "react-native";
import { Surface, IconButton, Text, Button } from "react-native-paper";
import Svg, { Path, G } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";

type KanaWritingProps = {
  strokes: string[];
  size: number;
  onComplete?: () => void;
};

type Point = { x: number; y: number };

// --- CONSTANTES ---
const GUIDELINE_COLOR = "#e5e5e5";
const STROKE_COLOR = "#1c1917";
const STROKE_WIDTH = 6;
const CANVAS_VIEWBOX = 109;
const CARD_PADDING = 20;

// Validación “al máximo” (muy estricta)
const MIN_POINTS_PER_STROKE = 18;       // requiere muchos puntos
const START_TOLERANCE = 6;              // inicio casi exacto
const END_TOLERANCE = 6;                // fin casi exacto
const LENGTH_MIN_RATIO = 0.95;          // longitud muy parecida
const LENGTH_MAX_RATIO = 1.05;

const TARGET_SAMPLES = 90;              // muestreo denso de la guía
const USER_SAMPLES_MAX = 200;
const ON_PATH_TOLERANCE = 4.5;          // distancia máx para considerar “sobre la guía”
const HAUSDORFF_MAX = 5.0;              // distancia máxima permitida (estricto)
const MONOTONIC_MIN_RATIO = 0.9;        // 90 % de los puntos del usuario deben avanzar

// Helper: downsample
const downsamplePoints = (points: Point[], maxPoints: number): Point[] => {
  if (points.length <= maxPoints) return points;
  const result: Point[] = [];
  const step = points.length / maxPoints;
  for (let i = 0; i < points.length; i += step) {
    result.push(points[Math.floor(i)]);
  }
  return result;
};

export const KanaWriting = ({ strokes, size, onComplete }: KanaWritingProps) => {
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [userPath, setUserPath] = useState<string>("");
  const [completedPaths, setCompletedPaths] = useState<string[]>([]);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>(
    { width: CANVAS_VIEWBOX, height: CANVAS_VIEWBOX }
  );

  const isFinished = currentStrokeIndex >= strokes.length;
  const currentPoints = useRef<Point[]>([]);

  // Área cuadrada donde se dibuja el kana, centrada dentro de la tarjeta
  const innerTargetSize = size - CARD_PADDING * 2;

  useEffect(() => {
    resetCanvas();
  }, [strokes]);

  const resetCanvas = () => {
    setCurrentStrokeIndex(0);
    setCompletedPaths([]);
    setUserPath("");
    setStrokeColor(STROKE_COLOR);
    currentPoints.current = [];
  };

  const targetProps = useMemo(() => {
    if (isFinished || !strokes[currentStrokeIndex]) return null;
    return new svgPathProperties(strokes[currentStrokeIndex]);
  }, [strokes, currentStrokeIndex, isFinished]);

  // --- VALIDACIÓN: “trazado igual a la guía” ---
  const validateStroke = () => {
    const rawPoints = currentPoints.current;

    if (!targetProps || rawPoints.length < MIN_POINTS_PER_STROKE) {
      handleError();
      return;
    }

    const targetLength = targetProps.getTotalLength();

    // Longitud del trazo del usuario
    let userLength = 0;
    for (let i = 1; i < rawPoints.length; i++) {
      const dx = rawPoints[i].x - rawPoints[i - 1].x;
      const dy = rawPoints[i].y - rawPoints[i - 1].y;
      userLength += Math.hypot(dx, dy);
    }

    const lengthRatio = userLength / targetLength;
    if (lengthRatio < LENGTH_MIN_RATIO || lengthRatio > LENGTH_MAX_RATIO) {
      handleError();
      return;
    }

    // Inicio casi exacto
    const startTarget = targetProps.getPointAtLength(0);
    const startUser = rawPoints[0];
    const distStart = Math.hypot(
      startUser.x - startTarget.x,
      startUser.y - startTarget.y
    );
    if (distStart > START_TOLERANCE) {
      handleError();
      return;
    }

    // Final casi exacto
    const endTarget = targetProps.getPointAtLength(targetLength);
    const endUser = rawPoints[rawPoints.length - 1];
    const distEnd = Math.hypot(
      endUser.x - endTarget.x,
      endUser.y - endTarget.y
    );
    if (distEnd > END_TOLERANCE) {
      handleError();
      return;
    }

    // Muestreamos la guía en TARGET_SAMPLES puntos
    const targetSamples: Point[] = [];
    for (let i = 0; i <= TARGET_SAMPLES; i++) {
      const p = targetProps.getPointAtLength(
        (targetLength * i) / TARGET_SAMPLES
      );
      targetSamples.push({ x: p.x, y: p.y });
    }

    // Downsample de puntos del usuario
    const userPoints = downsamplePoints(rawPoints, USER_SAMPLES_MAX);

    // 1) Distancia usuario → guía y monotonicidad sobre la guía
    let maxDistUserToTarget = 0;
    const nearestIdxForUser: number[] = [];

    for (const up of userPoints) {
      let minDist = Infinity;
      let bestIdx = 0;

      for (let j = 0; j < targetSamples.length; j++) {
        const tp = targetSamples[j];
        const dx = up.x - tp.x;
        const dy = up.y - tp.y;
        const d = Math.hypot(dx, dy);
        if (d < minDist) {
          minDist = d;
          bestIdx = j;
        }
      }

      maxDistUserToTarget = Math.max(maxDistUserToTarget, minDist);
      nearestIdxForUser.push(bestIdx);
    }

    // Monotonicidad: el índice de la guía debe aumentar casi siempre
    let forwardSteps = 0;
    for (let i = 1; i < nearestIdxForUser.length; i++) {
      if (nearestIdxForUser[i] >= nearestIdxForUser[i - 1]) {
        forwardSteps++;
      }
    }
    const monotonicRatio = forwardSteps / (nearestIdxForUser.length - 1 || 1);

    if (monotonicRatio < MONOTONIC_MIN_RATIO) {
      handleError();
      return;
    }

    // 2) Distancia guía → usuario (para asegurar que el usuario recorre todo)
    let maxDistTargetToUser = 0;
    for (const tp of targetSamples) {
      let minDist = Infinity;
      for (const up of userPoints) {
        const dx = up.x - tp.x;
        const dy = up.y - tp.y;
        const d = Math.hypot(dx, dy);
        if (d < minDist) minDist = d;
      }
      maxDistTargetToUser = Math.max(maxDistTargetToUser, minDist);
    }

    const hausdorff = Math.max(maxDistUserToTarget, maxDistTargetToUser);

    // Solo aceptamos si la distancia máxima es muy pequeña
    if (hausdorff <= HAUSDORFF_MAX && maxDistUserToTarget <= ON_PATH_TOLERANCE) {
      handleSuccess();
    } else {
      handleError();
    }
  };

  const handleSuccess = () => {
    setStrokeColor("#22c55e");

    setTimeout(() => {
      const nextIndex = currentStrokeIndex + 1;
      setCompletedPaths((prev) => [...prev, strokes[currentStrokeIndex]]);

      setUserPath("");
      currentPoints.current = [];
      setStrokeColor(STROKE_COLOR);

      if (nextIndex >= strokes.length) {
        if (onComplete) onComplete();
      }
      setCurrentStrokeIndex(nextIndex);
    }, 150);
  };

  const handleError = () => {
    setStrokeColor("#ef4444");
    setTimeout(() => {
      setUserPath("");
      currentPoints.current = [];
      setStrokeColor(STROKE_COLOR);
    }, 400);
  };

  // PanResponder: el trazo se dibuja bajo el dedo
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isFinished,
    onMoveShouldSetPanResponder: () => !isFinished,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;

      const scaleX = CANVAS_VIEWBOX / canvasSize.width;
      const scaleY = CANVAS_VIEWBOX / canvasSize.height;

      const x = locationX * scaleX;
      const y = locationY * scaleY;

      currentPoints.current = [{ x, y }];
      setUserPath(`M ${x} ${y}`);
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;

      const scaleX = CANVAS_VIEWBOX / canvasSize.width;
      const scaleY = CANVAS_VIEWBOX / canvasSize.height;

      const x = locationX * scaleX;
      const y = locationY * scaleY;

      currentPoints.current.push({ x, y });
      setUserPath((prev) => `${prev} L ${x} ${y}`);
    },

    onPanResponderRelease: validateStroke,
  });

  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <Surface
        style={{
          width: size,
          height: size,
          borderRadius: 32,
          backgroundColor: "white",
          overflow: "hidden",
          elevation: 2,
        }}
      >
        {/* Canvas cuadrado centrado */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              width: innerTargetSize,
              height: innerTargetSize,
            }}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setCanvasSize({ width, height });
            }}
            {...panResponder.panHandlers}
          >
            <Svg width="100%" height="100%" viewBox="0 0 109 109">
              {/* Cuadrícula */}
              <G opacity={0.1}>
                <Path
                  d="M54.5,0 L54.5,109 M0,54.5 L109,54.5"
                  stroke="#000"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              </G>

              {/* Trazos ya completados */}
              {completedPaths.map((d, i) => (
                <Path
                  key={`completed-${i}`}
                  d={d}
                  stroke={STROKE_COLOR}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Guía del trazo actual */}
              {!isFinished && strokes[currentStrokeIndex] && (
                <Path
                  d={strokes[currentStrokeIndex]}
                  stroke={GUIDELINE_COLOR}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Trazo del usuario */}
              <Path
                d={userPath}
                stroke={strokeColor}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9}
              />
            </Svg>
          </View>
        </View>

        {/* Overlay de éxito */}
        {isFinished && (
          <View style={styles.successOverlay}>
            <Text
              variant="headlineMedium"
              style={{
                color: "#22c55e",
                fontWeight: "900",
                marginBottom: 16,
              }}
            >
              正解 (Correcto)
            </Text>
            <Button mode="contained" buttonColor="#22c55e" onPress={resetCanvas}>
              Escribir de nuevo
            </Button>
          </View>
        )}
      </Surface>

      {/* Botón de reinicio fuera del área de escritura */}
      {!isFinished && (
        <IconButton
          icon="refresh"
          size={22}
          mode="contained"
          iconColor="#57534e"
          containerColor="rgba(245, 245, 244, 0.9)"
          onPress={resetCanvas}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
