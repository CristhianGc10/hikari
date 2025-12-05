// src/components/audio/AudioWaveformPlayer.tsx
import React, { useEffect, useRef } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface AudioWaveformPlayerProps {
  source: number | { uri: string };
  color: string;
  width?: number;
  height?: number;
  barCount?: number;
}

// Componente de barra individual
const WaveBar = ({
  index,
  height,
  maxHeight,
  barWidth,
  gap,
  color,
  isPlaying,
  progress,
  totalBars,
}: {
  index: number;
  height: number;
  maxHeight: number;
  barWidth: number;
  gap: number;
  color: string;
  isPlaying: boolean;
  progress: number;
  totalBars: number;
}) => {
  const animatedHeight = useSharedValue(4);
  const minHeight = 4;

  useEffect(() => {
    if (isPlaying) {
      // Calcular altura basada en posición y progreso
      const barPosition = index / totalBars;
      const distanceFromProgress = Math.abs(barPosition - progress);

      // Barras cerca del progreso son más altas
      const proximityFactor = Math.max(0, 1 - distanceFromProgress * 3);

      // Patrón de onda basado en índice y tiempo
      const wavePattern =
        Math.sin(index * 0.5 + progress * 20) * 0.3 +
        Math.cos(index * 0.3 + progress * 15) * 0.2 +
        Math.sin(index * 0.8 + progress * 25) * 0.15;

      const normalizedHeight = 0.3 + proximityFactor * 0.5 + wavePattern * 0.3;
      const targetHeight =
        minHeight +
        Math.max(0, Math.min(1, normalizedHeight)) * (maxHeight - minHeight);

      animatedHeight.value = withSpring(targetHeight, {
        damping: 12,
        stiffness: 180,
        mass: 0.3,
      });
    } else {
      // Estado de reposo con variación sutil
      const restHeight = minHeight + Math.sin(index * 0.5) * 2 + 2;
      animatedHeight.value = withTiming(restHeight, { duration: 400 });
    }
  }, [isPlaying, progress, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  const x = index * (barWidth + gap);
  const isPassed = index / totalBars < progress;

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          left: x,
          width: barWidth,
          backgroundColor: color,
          opacity: isPlaying ? (isPassed ? 0.9 : 0.5) : 0.35,
          borderRadius: barWidth / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const AudioWaveformPlayer: React.FC<AudioWaveformPlayerProps> = ({
  source,
  color,
  width = 280,
  height = 70,
  barCount = 30,
}) => {
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  const progressRef = useRef(0);

  // Calcular progreso
  const currentProgress =
    status.duration && status.duration > 0
      ? (status.currentTime || 0) / status.duration
      : 0;

  progressRef.current = currentProgress;

  // Dimensiones
  const gap = 3;
  const barWidth = (width - 16 - gap * (barCount - 1)) / barCount;
  const maxBarHeight = height - 20;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(currentProgress, { duration: 50 });
  }, [currentProgress]);

  const handlePress = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (status.currentTime >= (status.duration || 0) - 0.1) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <View
        style={[
          styles.container,
          {
            width,
            height,
            backgroundColor: `${color}10`,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: `${color}20`,
          },
        ]}
      >
        {/* Barras del waveform */}
        <View style={styles.barsContainer}>
          {Array.from({ length: barCount }).map((_, index) => (
            <WaveBar
              key={index}
              index={index}
              height={height}
              maxHeight={maxBarHeight}
              barWidth={barWidth}
              gap={gap}
              color={color}
              isPlaying={status.playing}
              progress={currentProgress}
              totalBars={barCount}
            />
          ))}
        </View>

        {/* Barra de progreso */}
        <View
          style={[styles.progressContainer, { backgroundColor: `${color}20` }]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: color },
              progressStyle,
            ]}
          />
        </View>

        {/* Indicador de estado */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: status.playing ? "#FFFFFF" : `${color}60` },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: { alignItems: "center" },
  container: { overflow: "hidden", justifyContent: "center" },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    position: "relative",
  },
  bar: { position: "absolute" },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
  },
  progressBar: { height: "100%" },
  statusContainer: { position: "absolute", top: 8, right: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});

export default AudioWaveformPlayer;
