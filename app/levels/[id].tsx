// app/levels/[id].tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Surface, ProgressBar, TouchableRipple } from 'react-native-paper';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  Play, 
  Lock, 
  Trophy // Volvemos a usar el Trofeo
} from 'lucide-react-native';

const levelsData: Record<string, any> = {
  n5: {
    title: 'JLPT N5',
    subtitle: 'Principiante',
    description: 'Todo lo que necesitas para empezar japonés con una base N5 sólida.',
    color: '#22c55e',
    modules: [
      { id: 'm1', type: 'kana',      title: 'Kana (仮名)',          sub: 'Hiragana y Katakana',       progress: 1.0 },
      { id: 'm2', type: 'vocab',     title: 'Vocabulario (語彙)',   sub: 'Palabras esenciales',       progress: 0.4 },
      { id: 'm3', type: 'grammar',   title: 'Gramática (文法)',     sub: 'Estructuras base',          progress: 0.0 },
      { id: 'm4', type: 'listening', title: 'Escucha (聴解)',       sub: 'Comprensión auditiva',      progress: 0.0 },
      { id: 'm5', type: 'reading',   title: 'Lectura (読解)',       sub: 'Textos cortos',             progress: 0.0 },
      { id: 'm6', type: 'speaking',  title: 'Hablar (会話)',        sub: 'Pronunciación y fluidez',   progress: 0.0 },
      { id: 'm7', type: 'writing',   title: 'Escribir (作文)',      sub: 'Composición básica',        progress: 0.0 },
    ]
  },
  default: {
    title: 'Nivel Bloqueado',
    subtitle: 'Próximamente',
    description: 'Contenido en desarrollo.',
    color: '#9ca3af',
    modules: []
  }
};

export default function LevelDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const levelId = typeof id === 'string' ? id : 'n5';
  const data = levelsData[levelId] || levelsData['default'];

  // Función para manejar la navegación según el módulo
  const handleModulePress = (module: any) => {
    if (module.type === 'kana') {
      router.push('/modules/kana');
    } else {
      console.log('Navegar a módulo:', module.title);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAF9' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        
        {/* HEADER INMERSIVO */}
        <View style={{ 
          backgroundColor: data.color, 
          paddingTop: insets.top + 20,
          paddingBottom: 32,
          paddingHorizontal: 24, 
          borderBottomLeftRadius: 32, 
          borderBottomRightRadius: 32,
          overflow: 'hidden'
        }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, zIndex: 1 }}>
              <Text variant="displaySmall" style={{ fontFamily: 'NotoSansJP_700Bold', color: 'white', fontWeight: '900', marginBottom: 4 }}>
                {data.title}
              </Text>
              <Text variant="bodyLarge" style={{ color: 'rgba(255,255,255,0.95)', lineHeight: 24, marginRight: 40 }}>
                {data.description}
              </Text>
            </View>

            {/* Kanji decorativo */}
            <Text style={{ 
              position: 'absolute', 
              right: -20, 
              top: insets.top - 40, 
              fontSize: 180, 
              opacity: 0.15, 
              color: 'white', 
              fontFamily: 'NotoSansJP_400Regular', 
              includeFontPadding: false 
            }}>
              {levelId === 'n5' ? '始' : '道'}
            </Text>
          </View>

          {/* Barra de progreso general */}
          <View style={{ marginTop: 24 }}> 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>PROGRESO DEL NIVEL</Text>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>14%</Text>
            </View>
            <ProgressBar progress={0.14} color="white" style={{ height: 6, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' }} />
          </View>
        </View>

        {/* LISTA DE MÓDULOS */}
        <View style={{ padding: 24, gap: 16 }}>
          <Text variant="titleLarge" style={{ fontFamily: 'NotoSansJP_700Bold', color: '#44403c', marginBottom: 4, fontWeight: 'bold' }}>
            Ruta de Aprendizaje
          </Text>

          {data.modules.map((module: any, index: number) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              themeColor={data.color}
              onPress={() => handleModulePress(module)} 
            />
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const ModuleCard = ({ module, themeColor, onPress }: { module: any, themeColor: string, onPress: () => void }) => {
  const isCompleted = module.progress >= 1.0;
  const isInProgress = module.progress > 0 && module.progress < 1.0;
  const isLocked = module.progress === 0;

  // Colores dinámicos
  const titleColor = isCompleted ? themeColor : (isLocked ? '#78716c' : '#1c1917');

  return (
    <Surface 
      style={{ 
        borderRadius: 20, 
        backgroundColor: 'white', 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e5e5', 
      }} 
      elevation={0} 
      mode="flat"
    >
      <TouchableRipple onPress={onPress} style={{ position: 'relative' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'space-between' }}>
            
            {/* CONTENIDO TEXTO (Izquierda limpia) */}
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text variant="titleMedium" numberOfLines={1} style={{ 
                fontWeight: 'bold', 
                color: titleColor, 
                marginBottom: 4,
                fontSize: 17
              }}>
                {module.title}
              </Text>
              
              <Text variant="bodyMedium" numberOfLines={1} style={{ color: '#78716c' }}>
                {module.sub}
              </Text>
            </View>

            {/* ACCIÓN / ESTADO (Derecha) */}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {isCompleted ? (
                // Usamos Trophy pero sin 'fill' para mantener el estilo outline
                <Trophy size={32} color={themeColor} strokeWidth={2} />
              ) : isInProgress ? (
                <Play size={32} color={themeColor} strokeWidth={2.5} style={{ marginLeft: 2 }} />
              ) : (
                <Lock size={28} color="#d6d3d1" strokeWidth={2} />
              )}
            </View>

          </View>

          {/* BARRA DE PROGRESO (Solo si está en curso) */}
          {isInProgress && (
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: 4, 
              backgroundColor: '#f0f0f0' 
            }}>
              <View style={{ 
                height: '100%', 
                backgroundColor: themeColor, 
                width: `${module.progress * 100}%` 
              }} />
            </View>
          )}
        </View>
      </TouchableRipple>
    </Surface>
  );
};