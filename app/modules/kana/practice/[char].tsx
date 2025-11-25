import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, IconButton, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, G } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing, 
  runOnJS 
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { svgPathProperties } from 'svg-path-properties';
import { Play, RotateCcw, CheckCircle2, ArrowLeft } from 'lucide-react-native';

// --- DATOS KANJIVG (Ejemplo con 'あ', deberías expandir esto) ---
const KANA_DATA: Record<string, { strokes: string[] }> = {
  'あ': {
    strokes: [
      "M 29.25,25.75 c 2.5,1.12 6.38,0.75 9,0.5 c 8.62,-0.82 24.62,-3 34,-3.5 c 3.37,-0.18 6.62,0.17 9.25,1",
      "M 52.75,12 c 1.25,1.25 2,3 2,5 c 0,16.25 -0.5,49 -0.5,58.5 c 0,10 -5.75,2 -7.5,0.25",
      "M 29,64.5 c 2.12,1.25 4.5,1.16 7.25,-0.5 c 8.25,-5 13.75,-9.75 26.5,-17.25 c 22.73,-13.37 27.5,13.5 7.5,24 c -14.75,7.75 -10.75,-7.75 4,-7.5 c 8.75,0.15 13.5,5.25 16.5,10.75"
    ]
  },
  'い': {
    strokes: [
      "M 27.25,23.25 c 2.38,1.62 5.15,1.22 7.5,0.75 c 12.62,-2.5 26.38,-5.5 33,-6.5 c 3.88,-0.59 5.5,1.5 4.25,6 c -2.25,8.12 -7.25,28.25 -14.75,43.25 c -3.6,7.2 -6.75,1.5 -8.5,-1.25",
      "M 78.25,24.5 c 0.25,1.5 0.23,3.23 -0.25,4.75 c -3.5,11 -9.5,23.75 -19.25,37.25"
    ]
  }
  // ... Puedes agregar más caracteres aquí o cargar un JSON externo
};

const STROKE_COLOR = "#1c1917";
const GUIDELINE_COLOR = "#e5e5e5";
const SUCCESS_COLOR = "#22c55e";
const ERROR_COLOR = "#ef4444";
const CANVAS_SIZE = 280;

export default function KanaPracticeScreen() {
  const { char } = useLocalSearchParams();
  const router = useRouter();
  
  const character = typeof char === 'string' ? char : 'あ';
  const strokes = KANA_DATA[character]?.strokes || [];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#FAFAF9' }}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#FAFAF9' }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton icon={() => <ArrowLeft size={24} color="#1c1917" />} onPress={() => router.back()} />
            <Text variant="titleLarge" style={{ fontFamily: 'NotoSansJP_700Bold', color: '#1c1917' }}>
              Práctica: {character}
            </Text>
            <View style={{ width: 48 }} />
          </View>
        </SafeAreaView>

        <ScrollView contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 40 }}>
          <AnimationCard strokes={strokes} />
          <WritingCard strokes={strokes} />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimationCard = ({ strokes }: { strokes: string[] }) => {
  const [key, setKey] = useState(0);

  return (
    <Surface style={{ borderRadius: 24, backgroundColor: 'white', padding: 24, alignItems: 'center' }} elevation={1}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Play size={20} color="#22c55e" fill="#22c55e" />
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Orden de Trazos</Text>
        </View>
        <IconButton 
          icon={() => <RotateCcw size={20} color="#78716c" />} 
          onPress={() => setKey(k => k + 1)} 
          size={20}
        />
      </View>

      <View style={{ width: 150, height: 150, borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16 }}>
        <Svg width="100%" height="100%" viewBox="0 0 109 109">
          <G>
            {strokes.map((d, i) => (
              <Path key={i} d={d} stroke={GUIDELINE_COLOR} strokeWidth="4" fill="none" />
            ))}
          </G>
          <G key={key}>
            {strokes.map((d, i) => (
              <SingleStrokeAnimation key={i} d={d} index={i} />
            ))}
          </G>
        </Svg>
      </View>
    </Surface>
  );
};

const SingleStrokeAnimation = ({ d, index }: { d: string, index: number }) => {
  const progress = useSharedValue(0);
  const properties = useMemo(() => new svgPathProperties(d), [d]);
  const length = properties.getTotalLength();

  useEffect(() => {
    const delay = index * 800; 
    progress.value = 0;
    const timeout = setTimeout(() => {
        progress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: length * (1 - progress.value),
  }));

  return (
    <AnimatedPath
      d={d}
      stroke={STROKE_COLOR}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={length}
      animatedProps={animatedProps}
    />
  );
};

const WritingCard = ({ strokes }: { strokes: string[] }) => {
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [userPath, setUserPath] = useState<string>("");
  const [completedPaths, setCompletedPaths] = useState<string[]>([]);
  const [feedbackColor, setFeedbackColor] = useState<string>(STROKE_COLOR);
  const [isFinished, setIsFinished] = useState(false);

  const currentPoints = useRef<{x: number, y: number}[]>([]);
  const targetProperties = useMemo(() => {
    if (!strokes[currentStrokeIndex]) return null;
    return new svgPathProperties(strokes[currentStrokeIndex]);
  }, [strokes, currentStrokeIndex]);

  const pan = Gesture.Pan()
    .onStart((g: any) => {
      if (isFinished) return;
      currentPoints.current = [{ x: g.x, y: g.y }];
      runOnJS(updateUserPath)(`M ${g.x} ${g.y}`);
      runOnJS(setFeedbackColor)(STROKE_COLOR);
    })
    .onUpdate((g: any) => {
      if (isFinished) return;
      currentPoints.current.push({ x: g.x, y: g.y });
      const newPath = `${userPath} L ${g.x} ${g.y}`; 
      runOnJS(updateUserPath)(newPath);
    })
    .onEnd(() => {
      if (isFinished) return;
      runOnJS(validateStroke)();
    });

  function updateUserPath(path: string) {
    setUserPath(path);
  }

  function validateStroke() {
    if (!targetProperties) return;

    const userPoints = currentPoints.current;
    if (userPoints.length < 5) {
      setUserPath("");
      return;
    }

    const scale = CANVAS_SIZE / 109;
    const targetLen = targetProperties.getTotalLength();
    const startTarget = targetProperties.getPointAtLength(0);
    const endTarget = targetProperties.getPointAtLength(targetLen);

    const startUser = { x: userPoints[0].x / scale, y: userPoints[0].y / scale };
    const endUser = { x: userPoints[userPoints.length - 1].x / scale, y: userPoints[userPoints.length - 1].y / scale };

    const distStart = Math.hypot(startUser.x - startTarget.x, startUser.y - startTarget.y);
    const distEnd = Math.hypot(endUser.x - endTarget.x, endUser.y - endTarget.y);

    let matchScore = 0;
    const samples = 5;
    for (let i = 0; i <= samples; i++) {
      const targetP = targetProperties.getPointAtLength((targetLen * i) / samples);
      const minDetails = userPoints.reduce((min, p) => {
        const d = Math.hypot((p.x / scale) - targetP.x, (p.y / scale) - targetP.y);
        return d < min ? d : min;
      }, 1000);
      
      if (minDetails < 25) matchScore++;
    }

    const isStartValid = distStart < 30;
    const isShapeValid = matchScore >= (samples - 1);

    if (isStartValid && isShapeValid) {
      setFeedbackColor(SUCCESS_COLOR);
      setTimeout(() => {
        const nextIndex = currentStrokeIndex + 1;
        setCompletedPaths([...completedPaths, strokes[currentStrokeIndex]]);
        setUserPath("");
        
        if (nextIndex >= strokes.length) {
          setIsFinished(true);
        } else {
          setCurrentStrokeIndex(nextIndex);
        }
      }, 200);
    } else {
      setFeedbackColor(ERROR_COLOR);
      setTimeout(() => setUserPath(""), 500);
    }
  }

  const reset = () => {
    setCurrentStrokeIndex(0);
    setCompletedPaths([]);
    setUserPath("");
    setIsFinished(false);
    setFeedbackColor(STROKE_COLOR);
  };

  return (
    <Surface style={{ borderRadius: 24, backgroundColor: 'white', padding: 24, alignItems: 'center' }} elevation={1}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Tu turno</Text>
          {isFinished && <CheckCircle2 size={20} color={SUCCESS_COLOR} />}
        </View>
        <Text variant="bodySmall" style={{ color: '#78716c' }}>
          Trazo {isFinished ? strokes.length : currentStrokeIndex + 1} / {strokes.length}
        </Text>
      </View>

      <View style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, alignSelf: 'center' }}>
        <GestureDetector gesture={pan}>
          <View style={{ width: '100%', height: '100%', backgroundColor: '#fafafa', borderRadius: 16, borderWidth: 1, borderColor: '#e5e5e5', overflow: 'hidden' }}>
            <Svg width="100%" height="100%" viewBox="0 0 109 109">
              <G opacity={0.1}>
                <Path d="M 54.5,0 L 54.5,109 M 0,54.5 L 109,54.5" stroke="black" strokeDasharray="4,4" />
              </G>
              {completedPaths.map((d, i) => (
                <Path key={i} d={d} stroke={STROKE_COLOR} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {!isFinished && (
                <Path 
                  d={strokes[currentStrokeIndex]} 
                  stroke="#d6d3d1" 
                  strokeWidth="7" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity={0.5}
                />
              )}
              <G transform={`scale(${109 / CANVAS_SIZE})`}>
                <Path 
                  d={userPath} 
                  stroke={feedbackColor} 
                  strokeWidth={CANVAS_SIZE / 109 * 6} 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </G>
            </Svg>
          </View>
        </GestureDetector>
      </View>

      {isFinished && (
        <Button mode="contained" onPress={reset} style={{ marginTop: 24, backgroundColor: SUCCESS_COLOR }}>
          ¡Excelente! Repetir
        </Button>
      )}
    </Surface>
  );
};