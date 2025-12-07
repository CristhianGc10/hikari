import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";
import { Play, Pause } from "lucide-react-native";

interface AudioWaveformPlayerProps {
  source: number | { uri: string };
  color: string;
  width?: number;
  height?: number;
  barCount?: number;
  containerPadding?: number;
}

const getSourceHash = (source: number | { uri: string }): number => {
  if (typeof source === "number") return source;
  const str = source.uri;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const generateWaveformPattern = (count: number, seed: number): number[] => {
  const pattern: number[] = [];
  const s1 = (seed % 7) + 2;
  const s2 = (seed % 11) + 5;
  const s3 = (seed % 13) + 8;
  const p1 = ((seed % 100) / 100) * 0.3 + 0.1;
  const p2 = ((seed % 77) / 100) * 0.3 + 0.35;
  const p3 = ((seed % 53) / 100) * 0.3 + 0.6;
  const p4 = ((seed % 31) / 100) * 0.2 + 0.8;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const wave1 = Math.sin(t * Math.PI * s1) * 0.18;
    const wave2 = Math.sin(t * Math.PI * s2 + seed * 0.1) * 0.14;
    const wave3 = Math.cos(t * Math.PI * s3) * 0.1;
    const peak1 = Math.exp(-Math.pow((t - p1) * 5.5, 2)) * 0.45;
    const peak2 = Math.exp(-Math.pow((t - p2) * 4.5, 2)) * 0.5;
    const peak3 = Math.exp(-Math.pow((t - p3) * 5, 2)) * 0.4;
    const peak4 = Math.exp(-Math.pow((t - p4) * 6, 2)) * 0.3;
    const noise = Math.sin(i * 17.31 + seed * 0.7) * 0.07;
    const noise2 = Math.cos(i * 23.17 + seed * 0.3) * 0.05;

    const value =
      0.22 +
      wave1 +
      wave2 +
      wave3 +
      peak1 +
      peak2 +
      peak3 +
      peak4 +
      noise +
      noise2;
    pattern.push(Math.max(0.1, Math.min(1, value)));
  }
  return pattern;
};

const WaveformVisual = React.memo(
  ({
    pattern,
    width,
    height,
    barWidth,
    barGap,
    color,
  }: {
    pattern: number[];
    width: number;
    height: number;
    barWidth: number;
    barGap: number;
    color: string;
  }) => (
    <Svg width={width} height={height}>
      {pattern.map((amplitude, index) => {
        const barHeight = Math.max(4, amplitude * height * 0.9);
        const y = (height - barHeight) / 2;
        const x = index * (barWidth + barGap);
        return (
          <Rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={barWidth / 2}
            ry={barWidth / 2}
            fill={color}
          />
        );
      })}
    </Svg>
  )
);

const AudioWaveformPlayer: React.FC<AudioWaveformPlayerProps> = ({
  source,
  color,
  width = 320,
  height = 52,
  barCount = 45,
  containerPadding = 2,
}) => {
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  const lastTimestamp = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);

  const progress = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const buttonSize = 44;
  const gapBetweenButtonAndWave = 14;
  const availableWaveformWidth =
    width - containerPadding * 2 - buttonSize - gapBetweenButtonAndWave;
  const barGap = 2.5;
  const totalGapSpace = (barCount - 1) * barGap;
  const availableSpaceForBars = availableWaveformWidth - totalGapSpace;
  const barWidth = Math.max(1, availableSpaceForBars / barCount);
  const exactWaveformWidth = barCount * barWidth + (barCount - 1) * barGap;

  const sourceHash = useMemo(() => getSourceHash(source), [source]);
  const waveformPattern = useMemo(
    () => generateWaveformPattern(barCount, sourceHash),
    [barCount, sourceHash]
  );

  const animate = useCallback(() => {
    if (!status.playing || !status.duration) {
      animationFrameId.current = null;
      return;
    }

    const now = Date.now();
    const dt = (now - lastTimestamp.current) / 1000;
    lastTimestamp.current = now;

    const increment = dt / status.duration;
    const nextValue = progress.value + increment;

    if (nextValue >= progress.value) {
      progress.value = Math.min(1, nextValue);
    }

    if (nextValue < 1) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [status.playing, status.duration]);

  useEffect(() => {
    if (!status.isLoaded || !status.duration) return;

    const actual = status.currentTime / status.duration;
    const visual = progress.value;
    const diff = Math.abs(actual - visual);

    if (!status.playing) {
      progress.value = actual;
    } else {
      if (diff > 0.2) {
        progress.value = actual;
        lastTimestamp.current = Date.now();
      }
    }
  }, [status.currentTime, status.duration, status.playing]);

  useEffect(() => {
    if (status.playing) {
      lastTimestamp.current = Date.now();
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [status.playing, animate]);

  useEffect(() => {
    if (!status.playing && status.currentTime === 0) {
      progress.value = withTiming(0, { duration: 150 });
    }
  }, [status.playing, status.currentTime]);

  const togglePlay = () => {
    buttonScale.value = withSpring(0.85, { damping: 12 }, () => {
      buttonScale.value = withSpring(1);
    });

    if (status.playing) {
      player.pause();
    } else {
      if (status.duration && status.currentTime >= status.duration - 0.1) {
        player.seekTo(0);
        progress.value = 0;
        setTimeout(() => player.play(), 50);
      } else {
        player.play();
      }
    }
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const maskStyle = useAnimatedStyle(() => ({
    width: progress.value * exactWaveformWidth,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          width: width,
          paddingHorizontal: containerPadding,
          height: height + 10,
        },
      ]}
    >
      <Pressable onPress={togglePlay} hitSlop={10}>
        <Animated.View
          style={[
            styles.circleButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              borderColor: color,
              backgroundColor: status.playing ? color : "transparent",
            },
            buttonStyle,
          ]}
        >
          {status.playing ? (
            <Pause size={18} fill="#FFF" color="#FFF" />
          ) : (
            <Play
              size={18}
              fill={color}
              color={color}
              style={{ marginLeft: 2 }}
            />
          )}
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={togglePlay}
        style={{ marginLeft: gapBetweenButtonAndWave }}
        hitSlop={5}
      >
        <View style={{ width: exactWaveformWidth, height: height }}>
          <View style={{ opacity: 0.3 }}>
            <WaveformVisual
              pattern={waveformPattern}
              width={exactWaveformWidth}
              height={height}
              barWidth={barWidth}
              barGap={barGap}
              color={color}
            />
          </View>

          <Animated.View style={[styles.mask, maskStyle]}>
            <WaveformVisual
              pattern={waveformPattern}
              width={exactWaveformWidth}
              height={height}
              barWidth={barWidth}
              barGap={barGap}
              color={color}
            />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  circleButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  mask: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    overflow: "hidden",
    zIndex: 10,
  },
});

export default AudioWaveformPlayer;
