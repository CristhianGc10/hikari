// app/index.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, ProgressBar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const levels = [
  { id: 'n5', title: 'N5', sub: 'Principiante', color: '#22c55e', kanji: '始' },
  { id: 'n4', title: 'N4', sub: 'Básico',       color: '#0ea5e9', kanji: '基' },
  { id: 'n3', title: 'N3', sub: 'Intermedio',   color: '#eab308', kanji: '中' },
  { id: 'n2', title: 'N2', sub: 'Avanzado',     color: '#f97316', kanji: '上' },
  { id: 'n1', title: 'N1', sub: 'Experto',      color: '#ef4444', kanji: '神' },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleContinue = () => {
    console.log('Continuar N5');
    // Ejemplo si luego defines una ruta:
    // router.push('/n5');
  };

  const handleOpenLevel = (levelId: string) => {
    console.log(`Ir a nivel ${levelId}`);
    // Ejemplo de navegación con Expo Router:
    // router.push(`/levels/${levelId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF9]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header con saludo */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text variant="titleMedium" style={{ color: '#78716c' }}>
                Konnichiwa,
              </Text>
              <Text
                variant="headlineMedium"
                style={{ fontFamily: 'NotoSansJP_700Bold', color: '#1c1917' }}
              >
                Estudiante-san
              </Text>
            </View>

            <Avatar.Text
              size={48}
              label="ES"
              style={{ backgroundColor: '#e7e5e4' }}
              color="#44403c"
            />
          </View>

          {/* Tarjeta principal “Continuar aprendizaje” */}
          <Card
            mode="elevated"
            style={{ backgroundColor: '#B91C1C' }}
            className="mb-8 shadow-md"
          >
            <Card.Content>
              <View className="flex-row justify-between items-start">
                <View>
                  <Text
                    variant="titleMedium"
                    style={{ color: '#fecaca', fontWeight: 'bold' }}
                  >
                    Continuar N5
                  </Text>
                  <Text
                    variant="headlineSmall"
                    style={{
                      color: 'white',
                      fontFamily: 'NotoSansJP_700Bold',
                      marginBottom: 8,
                    }}
                  >
                    Módulo 3: Hiragana
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="school"
                  size={40}
                  color="rgba(255,255,255,0.8)"
                />
              </View>

              <View className="mt-4">
                <View className="flex-row justify-between mb-1">
                  <Text variant="labelSmall" style={{ color: '#fecaca' }}>
                    Progreso del nivel
                  </Text>
                  <Text variant="labelSmall" style={{ color: 'white' }}>
                    12%
                  </Text>
                </View>

                <ProgressBar
                  progress={0.12}
                  color="white"
                  style={{
                    height: 6,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}
                />
              </View>

              <Button
                mode="contained"
                textColor="#B91C1C"
                style={{ backgroundColor: 'white', marginTop: 16, borderRadius: 8 }}
                onPress={handleContinue}
              >
                Reanudar Lección
              </Button>
            </Card.Content>
          </Card>

          {/* Título de sección */}
          <Text
            variant="titleLarge"
            style={{ fontFamily: 'NotoSansJP_700Bold', marginBottom: 16 }}
          >
            Niveles JLPT
          </Text>

          {/* Lista de niveles */}
          <View className="gap-4">
            {levels.map((level) => (
              <Surface
                key={level.id}
                className="rounded-2xl overflow-hidden bg-white"
                elevation={1}
              >
                <Button
                  contentStyle={{ height: 80, justifyContent: 'flex-start' }}
                  labelStyle={{ width: '100%' }}
                  onPress={() => handleOpenLevel(level.id)}
                >
                  <View className="flex-row items-center w-full px-2">
                    {/* Indicador de nivel */}
                    <View
                      className="h-12 w-12 rounded-xl justify-center items-center mr-4"
                      style={{ backgroundColor: `${level.color}20` }}
                    >
                      <Text
                        style={{
                          color: level.color,
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}
                      >
                        {level.title}
                      </Text>
                    </View>

                    {/* Textos */}
                    <View className="flex-1">
                      <Text
                        variant="titleMedium"
                        style={{ fontFamily: 'NotoSansJP_700Bold' }}
                      >
                        {level.sub}
                      </Text>
                      <Text variant="bodySmall" className="text-gray-500">
                        0/50 Módulos completados
                      </Text>
                    </View>

                    {/* Kanji decorativo */}
                    <Text
                      style={{
                        fontSize: 32,
                        opacity: 0.1,
                        fontFamily: 'NotoSansJP_700Bold',
                        position: 'absolute',
                        right: 0,
                      }}
                    >
                      {level.kanji}
                    </Text>
                  </View>
                </Button>
              </Surface>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
