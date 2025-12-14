import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { VOCAB_DATA, getWordById } from '@/src/data/vocabData';

import AudioWaveformPlayer from '@/src/components/audio/AudioWaveformPlayer';
import { GraduationCap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// ============================================================================
// COLORES Y TOKENS - Tema oscuro
// ============================================================================

const colors = {
    bg: '#151621',
    surface: '#1E2030',
    text: {
        primary: '#FFFFFF',
        secondary: '#8F92A8',
        tertiary: '#5D6080',
    },
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// Tamaños calculados para evitar scroll
const SAFE_AREA_TOP = 50;
const PADDING = spacing.screen;
const BUTTON_HEIGHT = 50;
const VERTICAL_SPACING = spacing.xl;

// Altura disponible
const AVAILABLE_HEIGHT =
    height - SAFE_AREA_TOP - PADDING * 2 - BUTTON_HEIGHT - VERTICAL_SPACING * 3;

// Distribución: 60% imagen, 40% contenido
const IMAGE_SIZE = Math.min(width - PADDING * 2, AVAILABLE_HEIGHT * 0.55);
const CONTENT_SPACE = AVAILABLE_HEIGHT - IMAGE_SIZE - VERTICAL_SPACING;

// Waveform más compacto
const WAVEFORM_WIDTH = width - PADDING * 2;
const WAVEFORM_HEIGHT = 70;

// Colores por categoría
const CATEGORY_COLORS: Record<string, string> = {
    people: '#EC4899',
    food: '#F97316',
    clothes: '#0EA5E9',
    house: '#8B5CF6',
    vehicle: '#10B981',
    tools: '#EAB308',
    date: '#EC4899',
    time: '#6366F1',
    location: '#14B8A6',
    facility: '#EF4444',
    body: '#F43F5E',
    nature: '#10B981',
    condition: '#0EA5E9',
    work: '#A855F7',
    numbers: '#D946EF',
};

// ============================================================================
// MAPEO DE RECURSOS
// ============================================================================

const PEOPLE_IMAGES: Record<number, any> = {
    1: require('@/assets/vocab/image/personas/1.webp'),
    2: require('@/assets/vocab/image/personas/2.webp'),
};

const CATEGORY_IMAGES: Record<string, Record<number, any>> = {
    people: PEOPLE_IMAGES,
};

const PEOPLE_AUDIO: Record<number, any> = {
    1: require('@/assets/vocab/audio/personas/1.wav'),
    2: require('@/assets/vocab/audio/personas/2.wav'),
    3: require('@/assets/vocab/audio/personas/3.wav'),
    4: require('@/assets/vocab/audio/personas/4.wav'),
    5: require('@/assets/vocab/audio/personas/5.wav'),
    6: require('@/assets/vocab/audio/personas/6.wav'),
    7: require('@/assets/vocab/audio/personas/7.wav'),
    8: require('@/assets/vocab/audio/personas/8.wav'),
    9: require('@/assets/vocab/audio/personas/9.wav'),
    10: require('@/assets/vocab/audio/personas/10.wav'),
    11: require('@/assets/vocab/audio/personas/11.wav'),
    12: require('@/assets/vocab/audio/personas/12.wav'),
    13: require('@/assets/vocab/audio/personas/13.wav'),
    14: require('@/assets/vocab/audio/personas/14.wav'),
    15: require('@/assets/vocab/audio/personas/15.wav'),
    16: require('@/assets/vocab/audio/personas/16.wav'),
    17: require('@/assets/vocab/audio/personas/17.wav'),
    18: require('@/assets/vocab/audio/personas/18.wav'),
    19: require('@/assets/vocab/audio/personas/19.wav'),
    20: require('@/assets/vocab/audio/personas/20.wav'),
    21: require('@/assets/vocab/audio/personas/21.wav'),
    22: require('@/assets/vocab/audio/personas/22.wav'),
    23: require('@/assets/vocab/audio/personas/23.wav'),
    24: require('@/assets/vocab/audio/personas/24.wav'),
    25: require('@/assets/vocab/audio/personas/25.wav'),
    26: require('@/assets/vocab/audio/personas/26.wav'),
    27: require('@/assets/vocab/audio/personas/27.wav'),
    28: require('@/assets/vocab/audio/personas/28.wav'),
    29: require('@/assets/vocab/audio/personas/29.wav'),
    30: require('@/assets/vocab/audio/personas/30.wav'),
    31: require('@/assets/vocab/audio/personas/31.wav'),
    32: require('@/assets/vocab/audio/personas/32.wav'),
    33: require('@/assets/vocab/audio/personas/33.wav'),
    34: require('@/assets/vocab/audio/personas/34.wav'),
    35: require('@/assets/vocab/audio/personas/35.wav'),
    36: require('@/assets/vocab/audio/personas/36.wav'),
    37: require('@/assets/vocab/audio/personas/37.wav'),
    38: require('@/assets/vocab/audio/personas/38.wav'),
    39: require('@/assets/vocab/audio/personas/39.wav'),
    40: require('@/assets/vocab/audio/personas/40.wav'),
    41: require('@/assets/vocab/audio/personas/41.wav'),
    42: require('@/assets/vocab/audio/personas/42.wav'),
    43: require('@/assets/vocab/audio/personas/43.wav'),
    44: require('@/assets/vocab/audio/personas/44.wav'),
    45: require('@/assets/vocab/audio/personas/45.wav'),
    46: require('@/assets/vocab/audio/personas/46.wav'),
};

const CATEGORY_AUDIO: Record<string, Record<number, any>> = {
    people: PEOPLE_AUDIO,
};

// ============================================================================
// HELPERS
// ============================================================================

const getWordImage = (wordId: string, categoryId: string): any | null => {
    const categoryWords = VOCAB_DATA[categoryId];
    if (!categoryWords) return null;
    const wordIndex = categoryWords.findIndex((w) => w.id === wordId);
    if (wordIndex === -1) return null;
    const categoryImages = CATEGORY_IMAGES[categoryId];
    if (!categoryImages || !categoryImages[wordIndex + 1]) return null;
    return categoryImages[wordIndex + 1];
};

const getWordAudio = (wordId: string, categoryId: string): any | null => {
    const categoryWords = VOCAB_DATA[categoryId];
    if (!categoryWords) return null;
    const wordIndex = categoryWords.findIndex((w) => w.id === wordId);
    if (wordIndex === -1) return null;
    const categoryAudios = CATEGORY_AUDIO[categoryId];
    if (!categoryAudios || !categoryAudios[wordIndex + 1]) return null;
    return categoryAudios[wordIndex + 1];
};

const getCategoryFromId = (wordId: string): string => {
    const prefix = wordId.substring(0, 2);
    const categoryMap: Record<string, string> = {
        p0: 'people',
        f0: 'food',
        c0: 'clothes',
        h0: 'house',
        v0: 'vehicle',
        t0: 'tools',
        d0: 'date',
        tm: 'time',
        lo: 'location',
        fa: 'facility',
        b0: 'body',
        n0: 'nature',
        co: 'condition',
        w0: 'work',
        ad: 'adjectives',
        vb: 'verbs',
    };
    return categoryMap[prefix] || 'people';
};

// ============================================================================
// PANTALLA PRINCIPAL
// ============================================================================

export default function WordDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const wordId = typeof id === 'string' ? id : '';

    const word = useMemo(() => getWordById(wordId), [wordId]);
    const categoryId = word ? getCategoryFromId(word.id) : 'people';

    const wordImage = word ? getWordImage(word.id, categoryId) : null;
    const wordAudio = word ? getWordAudio(word.id, categoryId) : null;

    const categoryColor = CATEGORY_COLORS[categoryId] || CATEGORY_COLORS.people;

    if (!word) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>単語が見つかりません</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                {/* Imagen de la palabra */}
                {wordImage && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={wordImage}
                            style={styles.wordImage}
                            resizeMode="cover"
                        />
                    </View>
                )}

                {/* Espacio flexible */}
                <View style={styles.spacer} />

                {/* Contenido - SIN TARJETA, DIRECTO AL FONDO */}
                <View style={styles.wordSection}>
                    {/* Palabra japonesa y lectura */}
                    <View style={styles.wordHeader}>
                        <Text
                            style={[
                                styles.wordJapanese,
                                { color: categoryColor },
                            ]}
                        >
                            {word.japanese}
                        </Text>
                        {word.reading && word.reading !== word.japanese && (
                            <Text style={styles.wordReading}>
                                {word.reading}
                            </Text>
                        )}
                    </View>

                    {/* Reproductor de audio - CONSERVADO */}
                    {wordAudio && (
                        <View style={styles.audioContainer}>
                            <AudioWaveformPlayer
                                source={wordAudio}
                                color={categoryColor}
                                width={WAVEFORM_WIDTH}
                                height={WAVEFORM_HEIGHT}
                            />
                        </View>
                    )}
                </View>

                {/* Espacio flexible */}
                <View style={styles.spacer} />

                {/* Botón de práctica */}
                <Pressable
                    style={[
                        styles.practiceButton,
                        { backgroundColor: categoryColor },
                    ]}
                    onPress={() =>
                        router.push(
                            `/modules/vocab/practice/${categoryId}` as any
                        )
                    }
                >
                    <GraduationCap size={20} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.practiceButtonText}>練習</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: PADDING,
        paddingTop: spacing.lg,
        paddingBottom: PADDING,
        justifyContent: 'space-between',
    },
    errorText: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 16,
        color: colors.text.secondary,
    },

    // Imagen
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    wordImage: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: radius.xl,
    },

    // Espaciador flexible
    spacer: {
        flex: 1,
    },

    // Sección de palabra - SIN TARJETA
    wordSection: {
        alignItems: 'center',
        gap: spacing.xl,
    },
    wordHeader: {
        alignItems: 'center',
    },
    wordJapanese: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 48,
        includeFontPadding: false,
        textAlign: 'center',
    },
    wordReading: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: 16,
        color: colors.text.secondary,
        marginTop: spacing.sm,
        textAlign: 'center',
    },

    // Audio
    audioContainer: {
        width: '100%',
        alignItems: 'center',
    },

    // Botón de práctica
    practiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: BUTTON_HEIGHT,
        borderRadius: radius.md,
        gap: spacing.sm,
    },
    practiceButtonText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 16,
        color: '#FFFFFF',
    },
});
