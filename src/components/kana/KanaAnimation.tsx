import React, { useEffect, useState, useMemo } from "react"; 
import { View } from "react-native";
import { Surface, TouchableRipple, Text } from "react-native-paper";
import Svg, { Path, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { svgPathProperties } from "svg-path-properties";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const STROKE_COLOR = "#1c1917";
const GUIDELINE_COLOR = "#e5e5e5";
const CARD_PADDING = 20;
const STROKE_WIDTH = 6;

type KanaAnimationProps = {
  strokes: string[];
  size: number;
};

export const KanaAnimation = ({ strokes, size }: KanaAnimationProps) => {
  const [key, setKey] = useState(0);

  if (!strokes || strokes.length === 0) return null;

  return (
    <View style={{ alignItems: "center", gap: 20 }}>
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
        <TouchableRipple
          onPress={() => setKey((k) => k + 1)}
          style={{ flex: 1 }}
          borderless
        >
          <View style={{ flex: 1, padding: CARD_PADDING }}>
            <Svg width="100%" height="100%" viewBox="0 0 109 109">
              {/* Guía de fondo */}
              <G opacity={0.1}>
                <Path
                  d="M54.5,0 L54.5,109 M0,54.5 L109,54.5"
                  stroke="#000"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              </G>

              {/* Trazos base (sombra) */}
              <G>
                {strokes.map((d, i) => (
                  <Path
                    key={`bg-${i}`}
                    d={d}
                    stroke={GUIDELINE_COLOR}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </G>

              {/* Animación */}
              <G key={key}>
                {strokes.map((d, i) => (
                  <SingleStrokeAnimation key={`anim-${i}`} d={d} index={i} />
                ))}
              </G>
            </Svg>
          </View>
        </TouchableRipple>
      </Surface>

      <Text variant="bodyMedium" style={{ color: "#78716c" }}>
        Toca la tarjeta para repetir la animación
      </Text>
    </View>
  );
};

const SingleStrokeAnimation = ({ d, index }: { d: string; index: number }) => {
  const progress = useSharedValue(0);

  const length = useMemo(() => {
    try {
      const properties = new svgPathProperties(d);
      return properties.getTotalLength();
    } catch {
      return 300;
    }
  }, [d]);

  useEffect(() => {
    const delay = index * 900;
    progress.value = 0;

    const timeout = setTimeout(() => {
      progress.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, delay + 200);

    return () => clearTimeout(timeout);
  }, [index, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: length * (1 - progress.value),
    opacity: progress.value === 0 ? 0 : 1,
  }));

  return (
    <AnimatedPath
      d={d}
      stroke={STROKE_COLOR}
      strokeWidth={STROKE_WIDTH}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={[length, length]}
      animatedProps={animatedProps}
    />
  );
};
