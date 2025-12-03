// ScoreOverlay.tsx
// Animación simple y limpia de puntaje
// Contador numérico + texto japonés + circle ripple (estilo CSS box-shadow)

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  cancelAnimation,
  interpolate,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

// =============================================================================
// COMPONENTE DE CARACTER ANIMADO
// =============================================================================
interface AnimatedCharProps {
  char: string;
  color: string;
  delay: number;
}

function AnimatedChar({ char, color, delay }: AnimatedCharProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));

    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedView style={animStyle}>
      <Text style={[styles.labelText, { color }]}>{char}</Text>
    </AnimatedView>
  );
}

// =============================================================================
// TIPOS
// =============================================================================
interface ScoreOverlayProps {
  score: number;
  label: string;
  color: string;
  onRetry: () => void;
}

interface CircleRippleProps {
  color: string;
}

// =============================================================================
// CONSTANTES
// =============================================================================
const CENTER_CIRCLE_SIZE = 160;
const ANIMATION_DURATION = 1200;

// =============================================================================
// COMPONENTE DE RIPPLE (Estilo CSS box-shadow)
// =============================================================================
function CircleRipple({ color }: CircleRippleProps) {
  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    // Fade in suave al inicio
    fadeIn.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    // Ripple continuo
    progress.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(progress);
      cancelAnimation(fadeIn);
    };
  }, []);

  // Onda 1: 0 -> 32px
  const ring1Style = useAnimatedStyle(() => {
    const size =
      CENTER_CIRCLE_SIZE + interpolate(progress.value, [0, 1], [0, 32]);
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: 0.3 * fadeIn.value,
    };
  });

  // Onda 2: 32px -> 96px
  const ring2Style = useAnimatedStyle(() => {
    const size =
      CENTER_CIRCLE_SIZE + interpolate(progress.value, [0, 1], [32, 80]);
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: 0.3 * fadeIn.value,
    };
  });

  // Onda 3: 96px -> 160px
  const ring3Style = useAnimatedStyle(() => {
    const size =
      CENTER_CIRCLE_SIZE + interpolate(progress.value, [0, 1], [80, 136]);
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: 0.3 * fadeIn.value,
    };
  });

  // Onda 4: 160px -> 256px (con fade out)
  const ring4Style = useAnimatedStyle(() => {
    const size =
      CENTER_CIRCLE_SIZE + interpolate(progress.value, [0, 1], [136, 208]);
    const opacityVal = interpolate(progress.value, [0, 1], [0.3, 0]);
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: opacityVal * fadeIn.value,
    };
  });

  return (
    <View style={styles.rippleContainer}>
      <AnimatedView
        style={[styles.rippleRing, { backgroundColor: color }, ring4Style]}
      />
      <AnimatedView
        style={[styles.rippleRing, { backgroundColor: color }, ring3Style]}
      />
      <AnimatedView
        style={[styles.rippleRing, { backgroundColor: color }, ring2Style]}
      />
      <AnimatedView
        style={[styles.rippleRing, { backgroundColor: color }, ring1Style]}
      />
      <View style={styles.centerCircle} />
    </View>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================
export function ScoreOverlay({
  score,
  label,
  color,
  onRetry,
}: ScoreOverlayProps) {
  const [currentNumber, setCurrentNumber] = useState(0);

  const bgOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.95);

  // Contador animado
  useEffect(() => {
    let frameId: number;
    const startTime = Date.now();
    const duration = 800;
    const delayMs = 200;

    const timeout = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - delayMs;
        if (elapsed < 0) {
          frameId = requestAnimationFrame(animate);
          return;
        }
        const prog = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        setCurrentNumber(Math.round(eased * score));

        if (prog < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };
      frameId = requestAnimationFrame(animate);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [score]);

  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 250 });
    contentScale.value = withDelay(
      100,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
    );

    return () => {
      cancelAnimation(bgOpacity);
      cancelAnimation(contentScale);
    };
  }, [score]);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: contentScale.value }],
  }));

  const handlePress = useCallback(() => {
    onRetry();
  }, [onRetry]);

  return (
    <Pressable onPress={handlePress} style={styles.overlay}>
      <AnimatedView style={[styles.overlayBg, bgStyle]}>
        <CircleRipple color={color} />

        <AnimatedView style={[styles.centerContent, contentStyle]}>
          <View style={styles.scoreBlock}>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNumber, { color }]}>
                {currentNumber}
              </Text>
              <Text style={[styles.scoreUnit, { color }]}>点</Text>
            </View>
            <View style={styles.labelRow}>
              {label.split("").map((char, index) => (
                <AnimatedChar
                  key={index}
                  char={char}
                  color={color}
                  delay={900 + index * 150}
                />
              ))}
            </View>
          </View>
        </AnimatedView>
      </AnimatedView>
    </Pressable>
  );
}

// =============================================================================
// ESTILOS
// =============================================================================
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  rippleContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  rippleRing: {
    position: "absolute",
  },
  centerCircle: {
    width: CENTER_CIRCLE_SIZE,
    height: CENTER_CIRCLE_SIZE,
    borderRadius: CENTER_CIRCLE_SIZE / 2,
    backgroundColor: "#FFFFFF",
  },
  centerContent: {
    position: "absolute",
    width: CENTER_CIRCLE_SIZE,
    height: CENTER_CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBlock: {
    alignItems: "center",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreNumber: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 72,
    lineHeight: 72,
    includeFontPadding: false,
  },
  scoreUnit: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 24,
    marginLeft: 4,
    opacity: 0.8,
  },
  labelRow: {
    flexDirection: "row",
    marginTop: -4,
  },
  labelText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 18,
    letterSpacing: 4,
    includeFontPadding: false,
  },
});
