// app/index.tsx
import React from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Text, ProgressBar, Surface, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const levels = [
  { id: 'n5', title: 'N5', sub: 'Básico',       color: '#22c55e', kanji: '始' },
  { id: 'n4', title: 'N4', sub: 'Elemental',    color: '#0ea5e9', kanji: '基' },
  { id: 'n3', title: 'N3', sub: 'Intermedio',   color: '#eab308', kanji: '中' },
  { id: 'n2', title: 'N2', sub: 'Avanzado',     color: '#f97316', kanji: '上' },
  { id: 'n1', title: 'N1', sub: 'Experto',      color: '#ef4444', kanji: '神' },
];

export default function HomeScreen() {
  const router = useRouter();
  
  const { width } = Dimensions.get('window');
  const gap = 16;
  const padding = 24;
  const availableWidth = width - (padding * 2) - gap;
  const cardWidth = availableWidth / 2;

  const handleLevelPress = (id: string) => {
    router.push({ pathname: '/levels/[id]', params: { id } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAF9' }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: padding, 
          paddingVertical: 24, 
          gap: 24,
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. HEADER */}
        <View>
          <Text variant="bodyLarge" style={{ fontFamily: 'NotoSansJP_400Regular', color: '#78716c' }}>
            こんにちは、
          </Text>
          <Text variant="headlineSmall" style={{ fontFamily: 'NotoSansJP_700Bold', color: '#1c1917', fontWeight: 'bold' }}>
            Estudiante-san
          </Text>
        </View>

        {/* 2. HERO CARD */}
        <Surface style={{ borderRadius: 24, backgroundColor: '#B91C1C', overflow: 'hidden' }} elevation={3}>
          <TouchableRipple onPress={() => handleLevelPress('n5')} style={{ padding: 24 }}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View>
                  <Surface style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#991b1b', alignSelf: 'flex-start', marginBottom: 8 }}>
                    <Text style={{ color: '#fecaca', fontSize: 11, fontWeight: 'bold' }}>CONTINUAR</Text>
                  </Surface>
                  <Text variant="headlineMedium" style={{ fontFamily: 'NotoSansJP_700Bold', color: 'white', fontWeight: 'bold', lineHeight: 32 }}>
                    N5: Hiragana
                  </Text>
                </View>
                <MaterialCommunityIcons name="school" size={40} color="rgba(255,255,255,0.9)" />
              </View>
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fecaca', fontSize: 13 }}>Progreso del módulo</Text>
                  <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>25%</Text>
                </View>
                <ProgressBar progress={0.25} color="white" style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.3)' }} />
              </View>
            </View>
          </TouchableRipple>
        </Surface>

        {/* 3. GRID DE NIVELES */}
        <View>
          <Text variant="titleLarge" style={{ fontFamily: 'NotoSansJP_700Bold', color: '#44403c', fontWeight: 'bold', marginBottom: 16 }}>
            Mapa de Aprendizaje
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: gap }}>
            {levels.map((level) => (
              <LevelCard 
                key={level.id} 
                level={level} 
                width={cardWidth} 
                onPress={() => handleLevelPress(level.id)} 
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const LevelCard = ({ level, onPress, width }: { level: any, onPress: () => void, width: number }) => (
  <Surface style={{ width: width, height: 110, borderRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e5e5', overflow: 'hidden' }} elevation={0} mode="flat">
    <TouchableRipple onPress={onPress} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        
        {/* CAPA FONDO: Kanji Centrado Verticalmente */}
        {/* StyleSheet.absoluteFill hace que ocupe todo el espacio de la tarjeta, ignorando el padding del contenido */}
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'flex-end', paddingRight: 8 }]}>
          <Text style={{ 
            fontSize: 40, // Hice el kanji un poco más grande para que luzca mejor centrado
            opacity: 0.07, 
            color: 'black', 
            fontFamily: 'NotoSansJP_400Regular',
            lineHeight: 50 // Importante para centrado vertical preciso de la fuente
          }}>
            {level.kanji}
          </Text>
        </View>

        {/* CAPA CONTENIDO: Textos (encima del fondo) */}
        <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
          <View>
            <Text variant="headlineSmall" style={{ color: level.color, fontWeight: '900' }}>{level.title}</Text>
          </View>
          <View>
            <Text variant="titleMedium" style={{ color: '#57534e', fontWeight: 'bold' }}>{level.sub}</Text>
          </View>
        </View>

      </View>
    </TouchableRipple>
  </Surface>
);