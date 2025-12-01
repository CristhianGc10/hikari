// ScoreOverlayMorphing.tsx
// "Tinta Japonesa" (Sumi-e) - Versión Refinada y Elegante

import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import Svg, {
  Path,
  Circle,
  Ellipse,
  G,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  withRepeat,
  Easing,
  interpolate,
  cancelAnimation,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedView = Animated.createAnimatedComponent(View);

// --- PATHS SVG (Mismos paths, lógica visual mejorada) ---
const NUMBER_PATHS: Record<string, { d: string; length: number }> = {
  "0": {
    d: "M50 12 C22 12 12 32 12 55 C12 78 22 98 50 98 C78 98 88 78 88 55 C88 32 78 12 50 12",
    length: 230,
  },
  "1": { d: "M35 28 Q42 18 50 12 L50 98", length: 115 }, // Ajustado ligeramente para centrar
  "2": {
    d: "M18 32 C18 12 38 6 54 16 C72 28 76 44 58 62 L16 98 L84 98",
    length: 210,
  },
  "3": {
    d: "M22 22 C34 8 72 8 78 28 C84 48 56 54 50 54 C56 54 88 60 82 84 C76 104 34 108 18 92",
    length: 220,
  },
  "4": { d: "M62 98 L62 8 L12 68 L88 68", length: 185 },
  "5": {
    d: "M78 12 L28 12 L22 52 C38 42 78 42 82 68 C86 98 50 108 18 92",
    length: 205,
  },
  "6": {
    d: "M72 18 C52 6 18 28 14 58 C10 88 28 108 50 102 C72 96 82 76 76 56 C70 40 50 36 34 46 C18 58 18 78 34 88",
    length: 260,
  },
  "7": { d: "M12 12 L88 12 L42 98", length: 165 },
  "8": {
    d: "M50 54 C28 54 18 38 24 22 C30 8 70 8 76 22 C82 38 70 54 50 54 C28 54 12 68 18 88 C24 104 76 104 82 88 C88 68 70 54 50 54",
    length: 290,
  },
  "9": {
    d: "M28 96 C48 108 82 88 86 58 C90 28 70 8 50 12 C30 16 20 36 24 56 C28 72 48 78 64 68 C80 58 80 38 64 28",
    length: 255,
  },
};

const INK_BLOB_PATHS = [
  "M50 10 Q80 15 90 40 Q95 70 75 85 Q50 95 30 80 Q5 60 15 35 Q25 10 50 10",
  "M45 8 Q75 5 88 30 Q100 55 85 78 Q60 98 35 90 Q8 75 5 50 Q10 20 45 8",
  "M55 5 Q85 10 95 45 Q90 80 65 92 Q35 95 15 70 Q5 40 25 18 Q45 5 55 5",
];

const INK_SPLASH_PATHS = [
  "M10 10 Q15 5 20 12 Q18 18 10 15 Q8 12 10 10",
  "M8 8 Q14 4 18 10 Q16 16 9 14 Q5 11 8 8",
];

type ScoreOverlayMorphingProps = {
  score: number;
  label: string;
  color: string;
  onRetry: () => void;
};

// ============================================================
// COMPONENTE DE DÍGITO (MEJORADO: 3 CAPAS DE TINTA)
// ============================================================
const AnimatedDigit = ({
  digit,
  color,
  delay,
  size,
}: {
  digit: string;
  color: string;
  delay: number;
  size: number;
}) => {
  const progress = useSharedValue(0);
  const bleedProgress = useSharedValue(0);
  const pathData = NUMBER_PATHS[digit];

  useEffect(() => {
    progress.value = 0;
    bleedProgress.value = 0;

    // Trazo principal
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: 1100, // Un poco más rápido que antes (era 1400)
        easing: Easing.out(Easing.exp),
      })
    );

    // Efecto de sangrado (tinta expandiéndose en el papel)
    bleedProgress.value = withDelay(
      delay + 100,
      withTiming(1, {
        duration: 1600,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [digit, delay]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathData.length * (1 - progress.value),
  }));

  const bleedAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathData.length * (1 - bleedProgress.value),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: progress.value > 0.01 ? 1 : 0,
  }));

  return (
    <Animated.View
      style={[{ width: size, height: size * 1.1 }, containerStyle]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 110">
        {/* Capa 1: Sangrado profundo (Muy ancho y transparente) */}
        <AnimatedPath
          d={pathData.d}
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.08}
          strokeDasharray={[pathData.length, pathData.length]}
          animatedProps={bleedAnimatedProps}
        />
        {/* Capa 2: Cuerpo de la tinta (Ancho medio) */}
        <AnimatedPath
          d={pathData.d}
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.2}
          strokeDasharray={[pathData.length, pathData.length]}
          animatedProps={animatedProps}
        />
        {/* Capa 3: Núcleo definido (Fino y oscuro) */}
        <AnimatedPath
          d={pathData.d}
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={[pathData.length, pathData.length]}
          animatedProps={animatedProps}
        />
      </Svg>
    </Animated.View>
  );
};

// ============================================================
// MANCHA DE TINTA (MEJORADO: "RESPIRACIÓN" Y ROTACIÓN)
// ============================================================
const InkBlob = ({
  color,
  delay,
  size,
  pathIndex,
  offsetX = 0,
  offsetY = 0,
  maxOpacity = 0.12,
}: {
  color: string;
  delay: number;
  size: number;
  pathIndex: number;
  offsetX?: number;
  offsetY?: number;
  maxOpacity?: number;
}) => {
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(Math.random() * 360);
  const path = INK_BLOB_PATHS[pathIndex % INK_BLOB_PATHS.length];

  useEffect(() => {
    // 1. Aparición orgánica
    scale.value = withDelay(
      delay,
      withTiming(1, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      })
    );

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(maxOpacity, { duration: 800 }),
        withTiming(maxOpacity * 0.7, { duration: 3000 }) // Leve desvanecimiento
      )
    );

    // 2. Movimiento continuo (Respiración y rotación lenta)
    const breathingDelay = delay + 2000;

    scale.value = withDelay(
      breathingDelay,
      withRepeat(
        withSequence(
          withTiming(1.05, {
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0.95, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(rotation.value + (Math.random() > 0.5 ? 20 : -20), {
          duration: 8000,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotation);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: offsetX },
      { translateY: offsetY },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <AnimatedView style={[styles.inkBlob, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient
            id={`inkGrad${pathIndex}-${delay}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <Stop offset="30%" stopColor={color} stopOpacity="0.9" />
            <Stop offset="70%" stopColor={color} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Path d={path} fill={`url(#inkGrad${pathIndex}-${delay})`} />
      </Svg>
    </AnimatedView>
  );
};

// ============================================================
// SALPICADURA (MEJORADO: EXPLOSIVO)
// ============================================================
const InkSplash = ({
  color,
  delay,
  size,
  x,
  y,
  pathIndex,
}: {
  color: string;
  delay: number;
  size: number;
  x: number;
  y: number;
  pathIndex: number;
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const path = INK_SPLASH_PATHS[pathIndex % INK_SPLASH_PATHS.length];

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 200, mass: 0.8 }) // Más "snappy"
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(0.8, { duration: 50 }),
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x }, { translateY: y }, { scale: scale.value }],
  }));

  return (
    <AnimatedView style={[styles.inkSplash, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={path} fill={color} />
      </Svg>
    </AnimatedView>
  );
};

// ============================================================
// AURAS
// ============================================================

// 90+ : Aura completa
const InkAuraPerfect = ({ color, delay }: { color: string; delay: number }) => {
  return (
    <View style={styles.auraContainer}>
      <InkBlob
        color={color}
        delay={delay}
        size={320}
        pathIndex={0}
        maxOpacity={0.1}
      />
      <InkBlob
        color={color}
        delay={delay + 150}
        size={280}
        pathIndex={1}
        offsetX={40}
        offsetY={-30}
        maxOpacity={0.08}
      />
      <InkSplash
        color={color}
        delay={delay + 400}
        size={24}
        x={-70}
        y={-60}
        pathIndex={0}
      />
      <InkSplash
        color={color}
        delay={delay + 500}
        size={18}
        x={80}
        y={50}
        pathIndex={1}
      />
      <InkSplash
        color={color}
        delay={delay + 600}
        size={14}
        x={-40}
        y={80}
        pathIndex={0}
      />
    </View>
  );
};

// 70-89 : Mancha media
const InkAuraPass = ({ color, delay }: { color: string; delay: number }) => {
  return (
    <View style={styles.auraContainer}>
      <InkBlob
        color={color}
        delay={delay}
        size={260}
        pathIndex={2}
        maxOpacity={0.08}
      />
      <InkBlob
        color={color}
        delay={delay + 200}
        size={200}
        pathIndex={0}
        offsetX={-30}
        offsetY={30}
        maxOpacity={0.06}
      />
    </View>
  );
};

// <70 : Sutil
const InkAuraSimple = ({ color, delay }: { color: string; delay: number }) => {
  return (
    <View style={styles.auraContainer}>
      <InkBlob
        color={color}
        delay={delay}
        size={180}
        pathIndex={1}
        maxOpacity={0.05}
      />
    </View>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export const ScoreOverlayMorphing = ({
  score,
  label,
  color,
  onRetry,
}: ScoreOverlayMorphingProps) => {
  const digits = String(score).split("");

  // Animaciones de contenedor
  const bgOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const labelTranslateY = useSharedValue(15);

  // TIEMPOS
  const digitDuration = 1100;
  const stagger = 250; // Más rápido entre dígitos
  const totalWriteTime = digits.length * stagger + digitDuration;

  useEffect(() => {
    // 1. Fade In Fondo
    bgOpacity.value = withTiming(1, { duration: 300 });

    // 2. Fade In Contenido principal
    contentOpacity.value = withTiming(1, { duration: 300 });

    // 3. Label aparece suavemente
    labelOpacity.value = withDelay(
      totalWriteTime - 400,
      withTiming(1, { duration: 800 })
    );
    labelTranslateY.value = withDelay(
      totalWriteTime - 400,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
  }, [score]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ translateY: labelTranslateY.value }],
  }));

  const digitSize = digits.length === 3 ? 60 : digits.length === 2 ? 80 : 100;

  const renderAura = () => {
    const delay = 200; // Aura empieza casi junto con los números
    if (score >= 90) return <InkAuraPerfect color={color} delay={delay} />;
    if (score >= 70) return <InkAuraPass color={color} delay={delay} />;
    return <InkAuraSimple color={color} delay={delay} />;
  };

  return (
    <Pressable onPress={onRetry} style={[styles.overlay, { zIndex: 100 }]}>
      <AnimatedView style={[styles.overlayBg, containerStyle]}>
        {renderAura()}

        <AnimatedView style={[styles.centerContent, contentStyle]}>
          <View style={styles.digitsRow}>
            {digits.map((digit, index) => (
              <AnimatedDigit
                key={`${digit}-${index}`}
                digit={digit}
                color={color}
                delay={index * stagger}
                size={digitSize}
              />
            ))}

            <AnimatedView style={[styles.unitWrapper, labelStyle]}>
              <Text style={[styles.unitText, { color }]}>点</Text>
            </AnimatedView>
          </View>

          <AnimatedView style={labelStyle}>
            <Text style={[styles.labelText, { color }]}>{label}</Text>
          </AnimatedView>
        </AnimatedView>
      </AnimatedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  auraContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  digitsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  unitWrapper: {
    marginLeft: 4,
  },
  unitText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 24,
    opacity: 0.7,
  },
  labelText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 20,
    marginTop: 12,
    letterSpacing: 6,
    textAlign: "center",
    textTransform: "uppercase",
    opacity: 0.8,
  },
  inkBlob: {
    position: "absolute",
  },
  inkSplash: {
    position: "absolute",
  },
});

export default ScoreOverlayMorphing;
