import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { listItemEnter, pressScale, releaseScale, materialEasing, materialDuration } from '@/src/core/animations';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
// app/modules/kana/index.tsx
import React, { useEffect, useRef, useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

// ============================================================================
// COLORES Y TOKENS
// ============================================================================

const colors = {
    bg: '#151621',
    surface: '#1E2030',
    surfaceLight: '#262940',
    text: {
        primary: '#FFFFFF',
        secondary: '#8F92A8',
        tertiary: '#5D6080',
    },
    levels: {
        n5: { primary: '#F0A55A', light: 'rgba(240, 165, 90, 0.12)' },
        n4: { primary: '#5AC78B', light: 'rgba(90, 199, 139, 0.12)' },
    },
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

// ============================================================================
// HELPERS
// ============================================================================

const getKanaColors = (mode: 'hiragana' | 'katakana') => {
    if (mode === 'hiragana') {
        return {
            main: colors.levels.n5.primary,
            bg: colors.levels.n5.light,
        };
    }
    return {
        main: colors.levels.n4.primary,
        bg: colors.levels.n4.light,
    };
};

// ============================================================================
// DATOS - 119 CARACTERES ORGANIZADOS POR CATEGORÍAS
// ============================================================================

const HIRAGANA = {
    基本: [
        ['あ', 'い', 'う'],
        ['え', 'お', 'か'],
        ['き', 'く', 'け'],
        ['こ', 'さ', 'し'],
        ['す', 'せ', 'そ'],
        ['た', 'ち', 'つ'],
        ['て', 'と', 'な'],
        ['に', 'ぬ', 'ね'],
        ['の', 'は', 'ひ'],
        ['ふ', 'へ', 'ほ'],
        ['ま', 'み', 'む'],
        ['め', 'も', 'や'],
        ['ゆ', 'よ', 'ら'],
        ['り', 'る', 'れ'],
        ['ろ', 'わ', 'を'],
        ['ん', '', ''],
    ],
    濁音: [
        ['が', 'ぎ', 'ぐ'],
        ['げ', 'ご', 'ざ'],
        ['じ', 'ず', 'ぜ'],
        ['ぞ', 'だ', 'ぢ'],
        ['づ', 'で', 'ど'],
        ['ば', 'び', 'ぶ'],
        ['べ', 'ぼ', ''],
    ],
    半濁音: [
        ['ぱ', 'ぴ', 'ぷ'],
        ['ぺ', 'ぽ', ''],
    ],
    拗音: [
        ['きゃ', 'きゅ', 'きょ'],
        ['しゃ', 'しゅ', 'しょ'],
        ['ちゃ', 'ちゅ', 'ちょ'],
        ['にゃ', 'にゅ', 'にょ'],
        ['ひゃ', 'ひゅ', 'ひょ'],
        ['みゃ', 'みゅ', 'みょ'],
        ['りゃ', 'りゅ', 'りょ'],
    ],
    拗濁音: [
        ['ぎゃ', 'ぎゅ', 'ぎょ'],
        ['じゃ', 'じゅ', 'じょ'],
        ['びゃ', 'びゅ', 'びょ'],
        ['ぴゃ', 'ぴゅ', 'ぴょ'],
    ],
};

const KATAKANA = {
    基本: [
        ['ア', 'イ', 'ウ'],
        ['エ', 'オ', 'カ'],
        ['キ', 'ク', 'ケ'],
        ['コ', 'サ', 'シ'],
        ['ス', 'セ', 'ソ'],
        ['タ', 'チ', 'ツ'],
        ['テ', 'ト', 'ナ'],
        ['ニ', 'ヌ', 'ネ'],
        ['ノ', 'ハ', 'ヒ'],
        ['フ', 'ヘ', 'ホ'],
        ['マ', 'ミ', 'ム'],
        ['メ', 'モ', 'ヤ'],
        ['ユ', 'ヨ', 'ラ'],
        ['リ', 'ル', 'レ'],
        ['ロ', 'ワ', 'ヲ'],
        ['ン', '', ''],
    ],
    濁音: [
        ['ガ', 'ギ', 'グ'],
        ['ゲ', 'ゴ', 'ザ'],
        ['ジ', 'ズ', 'ゼ'],
        ['ゾ', 'ダ', 'ヂ'],
        ['ヅ', 'デ', 'ド'],
        ['バ', 'ビ', 'ブ'],
        ['ベ', 'ボ', ''],
    ],
    半濁音: [
        ['パ', 'ピ', 'プ'],
        ['ペ', 'ポ', ''],
    ],
    拗音: [
        ['キャ', 'キュ', 'キョ'],
        ['シャ', 'シュ', 'ショ'],
        ['チャ', 'チュ', 'チョ'],
        ['ニャ', 'ニュ', 'ニョ'],
        ['ヒャ', 'ヒュ', 'ヒョ'],
        ['ミャ', 'ミュ', 'ミョ'],
        ['リャ', 'リュ', 'リョ'],
    ],
    拗濁音: [
        ['ギャ', 'ギュ', 'ギョ'],
        ['ジャ', 'ジュ', 'ジョ'],
        ['ビャ', 'ビュ', 'ビョ'],
        ['ピャ', 'ピュ', 'ピョ'],
    ],
};

// ============================================================================
// COMPONENTES
// ============================================================================

const ModeSelector = ({
    mode,
    onSelect,
}: {
    mode: 'hiragana' | 'katakana';
    onSelect: (mode: 'hiragana' | 'katakana') => void;
}) => {
    const selectorWidth = (width - spacing.screen * 2 - spacing.xs * 2) / 2;
    const hiraganaColors = getKanaColors('hiragana');
    const katakanaColors = getKanaColors('katakana');

    // Container Transform - usando Reanimated
    const translateX = useSharedValue(mode === 'hiragana' ? 0 : selectorWidth);

    useEffect(() => {
        const targetX = mode === 'hiragana' ? 0 : selectorWidth;
        translateX.value = withTiming(targetX, {
            duration: materialDuration.short3,
            easing: materialEasing.emphasized,
        });
    }, [mode, selectorWidth]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleSelect = (newMode: 'hiragana' | 'katakana') => {
        onSelect(newMode);
    };

    const indicatorColor = mode === 'hiragana' ? hiraganaColors.main : katakanaColors.main;

    return (
        <View style={styles.selector}>
            <Animated.View
                style={[
                    styles.selectorIndicator,
                    {
                        width: selectorWidth,
                        backgroundColor: indicatorColor,
                    },
                    animatedIndicatorStyle,
                ]}
            />

            <Pressable
                onPress={() => handleSelect('hiragana')}
                style={styles.selectorOption}
            >
                <Text
                    style={[
                        styles.selectorText,
                        mode === 'hiragana' && styles.selectorTextActive,
                    ]}
                >
                    ひらがな
                </Text>
            </Pressable>

            <Pressable
                onPress={() => handleSelect('katakana')}
                style={styles.selectorOption}
            >
                <Text
                    style={[
                        styles.selectorText,
                        mode === 'katakana' && styles.selectorTextActive,
                    ]}
                >
                    カタカナ
                </Text>
            </Pressable>
        </View>
    );
};

const CategorySection = ({
    title,
    rows,
    kanaColors,
    onCharPress,
    startIndex,
}: {
    title: string;
    rows: string[][];
    kanaColors: ReturnType<typeof getKanaColors>;
    onCharPress: (char: string) => void;
    startIndex: number;
}) => {
    return (
        <View style={styles.categorySection}>
            <Animated.View
                entering={listItemEnter(startIndex)}
                style={styles.categoryHeader}
            >
                <Text style={styles.categoryTitle}>{title}</Text>
            </Animated.View>
            {rows.map((row, rowIndex) => (
                <Animated.View
                    key={`${title}-row-${rowIndex}`}
                    entering={listItemEnter(startIndex + rowIndex + 1)}
                    style={styles.kanaRow}
                >
                    {row.map((char, colIndex) => (
                        <KanaCell
                            key={`${title}-${rowIndex}-${colIndex}`}
                            char={char}
                            kanaColors={kanaColors}
                            onPress={() => onCharPress(char)}
                        />
                    ))}
                </Animated.View>
            ))}
        </View>
    );
};

const KanaCell = ({
    char,
    kanaColors,
    onPress,
}: {
    char: string;
    kanaColors: ReturnType<typeof getKanaColors>;
    onPress: () => void;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (char) {
            scale.value = pressScale(0.92);
        }
    };

    const handlePressOut = () => {
        scale.value = releaseScale();
    };

    if (!char) {
        return <View style={styles.kanaCell} />;
    }

    return (
        <View style={styles.kanaCell}>
            <Animated.View style={animatedStyle}>
                <Pressable
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.kanaCellInner}
                >
                    <Text style={[styles.kanaChar, { color: kanaColors.main }]}>
                        {char}
                    </Text>
                </Pressable>
            </Animated.View>
        </View>
    );
};

// ============================================================================
// PANTALLA
// ============================================================================

export default function KanaModule() {
    const router = useRouter();
    const [mode, setMode] = useState<'hiragana' | 'katakana'>('hiragana');

    const data = mode === 'hiragana' ? HIRAGANA : KATAKANA;
    const kanaColors = getKanaColors(mode);

    const handleCharPress = (char: string) => {
        if (char) {
            router.push(`/modules/kana/practice?char=${encodeURIComponent(char)}&mode=${mode}` as any);
        }
    };

    const categories = Object.entries(data);
    let cumulativeIndex = 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                {/* Selector */}
                <View style={styles.selectorContainer}>
                    <ModeSelector mode={mode} onSelect={setMode} />
                </View>

                {/* Grid de caracteres organizados por categorías */}
                <ScrollView
                    contentContainerStyle={styles.gridContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {categories.map(([categoryName, rows]) => {
                        const startIndex = cumulativeIndex;
                        cumulativeIndex += rows.length + 1;
                        return (
                            <CategorySection
                                key={`${mode}-${categoryName}`}
                                title={categoryName}
                                rows={rows}
                                kanaColors={kanaColors}
                                onCharPress={handleCharPress}
                                startIndex={startIndex}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// ESTILOS
// ============================================================================

const CELL_SIZE = (width - spacing.screen * 2 - spacing.md * 2) / 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    content: {
        flex: 1,
    },

    // Selector
    selectorContainer: {
        paddingHorizontal: spacing.screen,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
    },
    selector: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.xs,
        position: 'relative',
    },
    selectorIndicator: {
        position: 'absolute',
        top: spacing.xs,
        left: spacing.xs,
        height: 52,
        borderRadius: radius.sm,
    },
    selectorOption: {
        flex: 1,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    selectorText: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 14,
        color: colors.text.tertiary,
        includeFontPadding: false,
    },
    selectorTextActive: {
        color: colors.text.primary,
    },

    // Grid
    gridContainer: {
        paddingHorizontal: spacing.screen,
        paddingBottom: spacing.xxl,
    },

    // Categorías
    categorySection: {
        marginBottom: spacing.xl,
    },
    categoryHeader: {
        marginBottom: spacing.md,
    },
    categoryTitle: {
        fontFamily: 'NotoSansJP_700Bold',
        fontSize: 13,
        color: colors.text.secondary,
        includeFontPadding: false,
        letterSpacing: 0.5,
    },

    // Celdas
    kanaRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    kanaCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
    },
    kanaCellInner: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kanaChar: {
        fontFamily: 'NotoSansJP_400Regular',
        fontSize: CELL_SIZE * 0.4,
        includeFontPadding: false,
    },
});
