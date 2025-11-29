// app/levels/[id].tsx
import React from 'react';
import { View, ScrollView, Dimensions, Platform } from 'react-native';
import { Text, Surface, TouchableRipple } from 'react-native-paper';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Check, Play, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Colores
const LEVEL_COLORS: Record<string, { color: string; colorLight: string; kanji: string }> = {
  n5: { color: '#F5A238', colorLight: '#FEF7ED', kanji: '始' },
  n4: { color: '#76BF54', colorLight: '#F3FAF0', kanji: '進' },
  n3: { color: '#E1444B', colorLight: '#FDF2F2', kanji: '道' },
  n2: { color: '#4387C8', colorLight: '#EFF6FC', kanji: '翔' },
  n1: { color: '#9056A2', colorLight: '#F8F3FA', kanji: '極' },
};

// DATOS
const levelsData: Record<string, any> = {
  n5: {
    title: 'N5',
    subtitle: '初級',
    modules: [
      { id: 'm1', type: 'kana', title: '仮名', sub: 'Hiragana y Katakana', progress: 1.0, kanji: '字' },
      { id: 'm2', type: 'vocab', title: '語彙', sub: '800 palabras esenciales', progress: 0.0, kanji: '言' },
      { id: 'm3', type: 'grammar', title: '文法', sub: 'Estructuras básicas', progress: 0.0, kanji: '文' },
      { id: 'm4', type: 'kanji', title: '漢字', sub: '100 caracteres', progress: 0.0, kanji: '字' },
      { id: 'm5', type: 'listening', title: '聴解', sub: 'Comprensión auditiva', progress: 0.0, kanji: '耳' },
      { id: 'm6', type: 'reading', title: '読解', sub: 'Textos cortos', progress: 0.0, kanji: '読' },
      { id: 'm7', type: 'practice', title: '練習', sub: 'Exámenes de prueba', progress: 0.0, kanji: '習' },
    ]
  },
  n4: {
    title: 'N4',
    subtitle: '初中級',
    modules: [
      { id: 'm1', type: 'vocab', title: '語彙', sub: '1,500 palabras', progress: 0.0, kanji: '言' },
      { id: 'm2', type: 'grammar', title: '文法', sub: 'Formas intermedias y conjugaciones', progress: 0.0, kanji: '文' },
      { id: 'm3', type: 'kanji', title: '漢字', sub: '300 caracteres', progress: 0.0, kanji: '字' },
      { id: 'm4', type: 'listening', title: '聴解', sub: 'Diálogos cotidianos', progress: 0.0, kanji: '耳' },
      { id: 'm5', type: 'reading', title: '読解', sub: 'Textos informativos', progress: 0.0, kanji: '読' },
      { id: 'm6', type: 'speaking', title: '会話', sub: 'Conversación básica', progress: 0.0, kanji: '話' },
      { id: 'm7', type: 'practice', title: '練習', sub: 'Exámenes de prueba', progress: 0.0, kanji: '習' },
    ]
  },
  n3: {
    title: 'N3',
    subtitle: '中級',
    modules: [
      { id: 'm1', type: 'vocab', title: '語彙', sub: '3,750 palabras', progress: 0.0, kanji: '言' },
      { id: 'm2', type: 'grammar', title: '文法', sub: 'Estructuras complejas', progress: 0.0, kanji: '文' },
      { id: 'm3', type: 'kanji', title: '漢字', sub: '650 caracteres', progress: 0.0, kanji: '字' },
      { id: 'm4', type: 'listening', title: '聴解', sub: 'Noticias y entrevistas', progress: 0.0, kanji: '耳' },
      { id: 'm5', type: 'reading', title: '読解', sub: 'Artículos y ensayos', progress: 0.0, kanji: '読' },
      { id: 'm6', type: 'speaking', title: '会話', sub: 'Expresión de opiniones', progress: 0.0, kanji: '話' },
      { id: 'm7', type: 'practice', title: '練習', sub: 'Exámenes de prueba', progress: 0.0, kanji: '習' },
    ]
  },
  n2: {
    title: 'N2',
    subtitle: '中上級',
    modules: [
      { id: 'm1', type: 'vocab', title: '語彙', sub: '6,000 palabras', progress: 0.0, kanji: '言' },
      { id: 'm2', type: 'grammar', title: '文法', sub: 'Expresiones formales', progress: 0.0, kanji: '文' },
      { id: 'm3', type: 'kanji', title: '漢字', sub: '1,000 caracteres', progress: 0.0, kanji: '字' },
      { id: 'm4', type: 'listening', title: '聴解', sub: 'Conferencias y debates', progress: 0.0, kanji: '耳' },
      { id: 'm5', type: 'reading', title: '読解', sub: 'Textos profesionales', progress: 0.0, kanji: '読' },
      { id: 'm6', type: 'writing', title: '作文', sub: 'Composición formal', progress: 0.0, kanji: '書' },
      { id: 'm7', type: 'practice', title: '練習', sub: 'Exámenes de prueba', progress: 0.0, kanji: '習' },
    ]
  },
  n1: {
    title: 'N1',
    subtitle: '上級',
    modules: [
      { id: 'm1', type: 'vocab', title: '語彙', sub: '10,000+ palabras', progress: 0.0, kanji: '言' },
      { id: 'm2', type: 'grammar', title: '文法', sub: 'Expresiones avanzadas', progress: 0.0, kanji: '文' },
      { id: 'm3', type: 'kanji', title: '漢字', sub: '2,000+ caracteres', progress: 0.0, kanji: '字' },
      { id: 'm4', type: 'listening', title: '聴解', sub: 'Contenido nativo', progress: 0.0, kanji: '耳' },
      { id: 'm5', type: 'reading', title: '読解', sub: 'Literatura y prensa', progress: 0.0, kanji: '読' },
      { id: 'm6', type: 'writing', title: '作文', sub: 'Redacción avanzada', progress: 0.0, kanji: '書' },
      { id: 'm7', type: 'practice', title: '練習', sub: 'Exámenes de prueba', progress: 0.0, kanji: '習' },
    ]
  },
};

export default function LevelDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const levelId = typeof id === 'string' ? id : 'n5';
  const data = levelsData[levelId] || levelsData['n5'];
  const colors = LEVEL_COLORS[levelId] || LEVEL_COLORS['n5'];

  const handleModulePress = (module: any) => {
    switch (module.type) {
      case 'kana':
        router.push('/modules/kana');
        break;
      case 'vocab':
        console.log("Navegando a Vocabulario");
        router.push('/modules/vocab');
        break;
      default:
        console.warn(`Ruta para ${module.type} no definida aún`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Header fijo */}
      <View style={{ 
        paddingTop: insets.top + 2,
        paddingHorizontal: 20,
        paddingBottom: 2,
        backgroundColor: '#FFFFFF',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'NotoSansJP_700Bold', fontSize: 22, color: colors.color }}>
            {data.title}
          </Text>
          <Text style={{ fontFamily: 'NotoSansJP_400Regular', fontSize: 16, color: '#6B7280', marginLeft: 8 }}>
            {data.subtitle}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {data.modules.map((module: any, index: number) => {
            const previousModule = index > 0 ? data.modules[index - 1] : null;
            const isUnlocked = index === 0 || (previousModule && previousModule.progress >= 1.0) || module.progress > 0;

            return (
              <PathNode
                key={module.id}
                module={module}
                index={index}
                isLast={index === data.modules.length - 1}
                themeColor={colors.color}
                colorLight={colors.colorLight}
                onPress={() => handleModulePress(module)}
                isUnlocked={isUnlocked}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

type PathNodeProps = {
  module: any;
  index: number;
  isLast: boolean;
  themeColor: string;
  colorLight: string;
  onPress: () => void;
  isUnlocked: boolean;
};

const PathNode = ({ module, index, isLast, themeColor, colorLight, onPress, isUnlocked }: PathNodeProps) => {
  const isCompleted = module.progress >= 1.0;
  const isInProgress = module.progress > 0 && module.progress < 1.0;
  const isLocked = !isUnlocked;
  const isCurrent = isUnlocked && !isCompleted && !isInProgress;

  const isLeft = index % 2 === 0;
  const nodeSize = 56;
  const lineWidth = 3;

  return (
    // CAMBIO 1: Quitamos "alignItems: 'flex-start'" para que las columnas se estiren
    <View style={{ flexDirection: 'row' }}>
      {/* Lado izquierdo */}
      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 16 }}>
        {isLeft && (
          <ModuleCard
            module={module}
            themeColor={themeColor}
            colorLight={colorLight}
            isCompleted={isCompleted}
            isInProgress={isInProgress}
            isLocked={isLocked}
            onPress={onPress}
          />
        )}
      </View>

      {/* Centro - Línea y nodo */}
      {/* Esta columna ahora se estira a la altura de la tarjeta (140px) */}
      <View style={{ alignItems: 'center', width: nodeSize, justifyContent: 'flex-start' }}>
        {/* Nodo circular (siempre arriba) */}
        <View
          style={{
            width: nodeSize,
            height: nodeSize,
            borderRadius: nodeSize / 2,
            backgroundColor: isCompleted ? themeColor : (isInProgress || isCurrent) ? themeColor : '#F3F4F6',
            borderWidth: isInProgress || isCurrent ? 3 : 0,
            borderColor: themeColor,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2, // Aseguramos que el círculo esté visualmente sobre la línea
          }}
        >
          {isCompleted ? (
            <Check size={28} color="#FFFFFF" strokeWidth={3} />
          ) : (isInProgress || isCurrent) ? (
            <Play size={22} color={isInProgress ? themeColor : "#FFFFFF"} strokeWidth={2.5} fill={isInProgress ? themeColor : "#FFFFFF"} />
          ) : (
            <Lock size={20} color="#9CA3AF" strokeWidth={2} />
          )}
        </View>

        {/* Línea conectora */}
        {!isLast && (
          <View
            style={{
              width: lineWidth,
              // CAMBIO 2: Usamos flex: 1 en lugar de altura fija para que llene el espacio
              flex: 1, 
              backgroundColor: isCompleted ? themeColor : '#E5E7EB',
              // CAMBIO 3: Eliminamos marginVertical para que toque el círculo
              marginVertical: 6,
            }}
          />
        )}
      </View>

      {/* Lado derecho */}
      <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 16 }}>
        {!isLeft && (
          <ModuleCard
            module={module}
            themeColor={themeColor}
            colorLight={colorLight}
            isCompleted={isCompleted}
            isInProgress={isInProgress}
            isLocked={isLocked}
            onPress={onPress}
          />
        )}
      </View>
    </View>
  );
};

type ModuleCardProps = {
  module: any;
  themeColor: string;
  colorLight: string;
  isCompleted: boolean;
  isInProgress: boolean;
  isLocked: boolean;
  onPress: () => void;
};

// --- MODULO CON SIMETRÍA AJUSTADA ---
const ModuleCard = ({ module, themeColor, colorLight, isCompleted, isInProgress, isLocked, onPress }: ModuleCardProps) => {
  const cardWidth = (width - 40 - 56 - 32) / 2;
  const isAccessible = !isLocked;
  
  // Padding vertical exacto para ambos extremos
  const verticalPadding = 16; 

  return (
    <Surface
      style={{
        width: cardWidth,
        height: 140, 
        borderRadius: 20,
        backgroundColor: (isCompleted || isInProgress) ? colorLight : '#F9FAFB',
        overflow: 'hidden',
        opacity: isLocked ? 0.6 : 1,
      }}
      elevation={0}
      mode="flat"
    >
      <TouchableRipple 
        onPress={onPress} 
        rippleColor={themeColor + '20'} 
        disabled={isLocked}
        style={{ flex: 1 }}
      >
        <View style={{ 
          flex: 1,
          paddingHorizontal: 14,
          paddingTop: verticalPadding,    
          paddingBottom: verticalPadding, 
          justifyContent: 'space-between' 
        }}>
          {/* Kanji decorativo (absoluto) */}
          <View style={{ position: 'absolute', right: 6, top: 6 }}>
            <Text
              style={{
                fontSize: 36,
                lineHeight: 36,
                color: (isCompleted || isInProgress || isAccessible) ? themeColor : '#D1D5DB',
                fontFamily: 'NotoSansJP_400Regular',
                opacity: 0.15,
                // Evitamos padding extra en el kanji de fondo también
                includeFontPadding: false,
              }}
            >
              {module.kanji}
            </Text>
          </View>

          {/* TITULO (Pegado arriba) */}
          <View>
            <Text
              style={{
                fontFamily: 'NotoSansJP_700Bold',
                fontSize: 18,
                // El lineHeight cercano al fontSize evita espacios fantasma
                lineHeight: 22, 
                color: (isCompleted || isInProgress || isAccessible) ? themeColor : '#6B7280',
                // Propiedad clave para Android: elimina el relleno interno de la fuente
                includeFontPadding: false, 
                // Aseguramos que no haya margen por defecto
                marginBottom: 0,
                marginTop: 0,
              }}
              numberOfLines={1}
            >
              {module.title}
            </Text>
          </View>

          {/* SUBTITULO + BARRA (Pegados abajo) */}
          <View style={{ justifyContent: 'flex-end' }}>
            <Text
              style={{
                fontFamily: 'NotoSansJP_400Regular',
                fontSize: 11,
                lineHeight: 14, // Ajustado para ser compacto
                color: '#9CA3AF',
                includeFontPadding: false,
                marginBottom: 0,
              }}
              numberOfLines={2} 
            >
              {module.sub}
            </Text>

            {/* Si hay barra, se añade debajo. El bloque entero se alinea al fondo */}
            {isInProgress && (
              <View style={{ marginTop: 8, height: 4, backgroundColor: themeColor + '30', borderRadius: 2 }}>
                <View style={{ width: `${module.progress * 100}%`, height: '100%', backgroundColor: themeColor, borderRadius: 2 }} />
              </View>
            )}
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};