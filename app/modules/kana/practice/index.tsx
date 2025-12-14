// app/modules/kana/practice/index.tsx

import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    Animated as RNAnimated,
    StyleSheet,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

import { KanaAnimation } from '@/src/components/kana/KanaAnimation';
import { KanaWriting } from '@/src/components/kana/KanaWriting';
import SVG_REGISTRY from '@/src/data/svgRegistry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native-paper';
import { loadStrokesWithMetadata } from '@/src/services/strokeLoader';
import { useAudioPlayer } from 'expo-audio';

const { width } = Dimensions.get('window');

// ============================================================================
// COLORES Y TOKENS
// ============================================================================

const colors = {
    bg: '#151621',
    surface: '#1E2030',
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

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, screen: 20 };
const radius = { sm: 10, md: 14 };

// ============================================================================
// AUDIO MAPPING
// ============================================================================

const AUDIO_FILES: Record<string, any> = {
    a: require('@/assets/audio/kana/a.wav'),
    i: require('@/assets/audio/kana/i.wav'),
    u: require('@/assets/audio/kana/u.wav'),
    e: require('@/assets/audio/kana/e.wav'),
    o: require('@/assets/audio/kana/o.wav'),
    ka: require('@/assets/audio/kana/ka.wav'),
    ki: require('@/assets/audio/kana/ki.wav'),
    ku: require('@/assets/audio/kana/ku.wav'),
    ke: require('@/assets/audio/kana/ke.wav'),
    ko: require('@/assets/audio/kana/ko.wav'),
    sa: require('@/assets/audio/kana/sa.wav'),
    shi: require('@/assets/audio/kana/shi.wav'),
    su: require('@/assets/audio/kana/su.wav'),
    se: require('@/assets/audio/kana/se.wav'),
    so: require('@/assets/audio/kana/so.wav'),
    ta: require('@/assets/audio/kana/ta.wav'),
    chi: require('@/assets/audio/kana/chi.wav'),
    tsu: require('@/assets/audio/kana/tsu.wav'),
    te: require('@/assets/audio/kana/te.wav'),
    to: require('@/assets/audio/kana/to.wav'),
    na: require('@/assets/audio/kana/na.wav'),
    ni: require('@/assets/audio/kana/ni.wav'),
    nu: require('@/assets/audio/kana/nu.wav'),
    ne: require('@/assets/audio/kana/ne.wav'),
    no: require('@/assets/audio/kana/no.wav'),
    ha: require('@/assets/audio/kana/ha.wav'),
    hi: require('@/assets/audio/kana/hi.wav'),
    fu: require('@/assets/audio/kana/fu.wav'),
    he: require('@/assets/audio/kana/he.wav'),
    ho: require('@/assets/audio/kana/ho.wav'),
    ma: require('@/assets/audio/kana/ma.wav'),
    mi: require('@/assets/audio/kana/mi.wav'),
    mu: require('@/assets/audio/kana/mu.wav'),
    me: require('@/assets/audio/kana/me.wav'),
    mo: require('@/assets/audio/kana/mo.wav'),
    ya: require('@/assets/audio/kana/ya.wav'),
    yu: require('@/assets/audio/kana/yu.wav'),
    yo: require('@/assets/audio/kana/yo.wav'),
    ra: require('@/assets/audio/kana/ra.wav'),
    ri: require('@/assets/audio/kana/ri.wav'),
    ru: require('@/assets/audio/kana/ru.wav'),
    re: require('@/assets/audio/kana/re.wav'),
    ro: require('@/assets/audio/kana/ro.wav'),
    wa: require('@/assets/audio/kana/wa.wav'),
    wo: require('@/assets/audio/kana/wo.wav'),
    n: require('@/assets/audio/kana/n.wav'),
    ga: require('@/assets/audio/kana/ga.wav'),
    gi: require('@/assets/audio/kana/gi.wav'),
    gu: require('@/assets/audio/kana/gu.wav'),
    ge: require('@/assets/audio/kana/ge.wav'),
    go: require('@/assets/audio/kana/go.wav'),
    za: require('@/assets/audio/kana/za.wav'),
    ji: require('@/assets/audio/kana/ji.wav'),
    zu: require('@/assets/audio/kana/zu.wav'),
    ze: require('@/assets/audio/kana/ze.wav'),
    zo: require('@/assets/audio/kana/zo.wav'),
};

const CHAR_TO_SOUND: Record<string, string> = {
    // Hiragana
    あ: 'a',
    い: 'i',
    う: 'u',
    え: 'e',
    お: 'o',
    か: 'ka',
    き: 'ki',
    く: 'ku',
    け: 'ke',
    こ: 'ko',
    さ: 'sa',
    し: 'shi',
    す: 'su',
    せ: 'se',
    そ: 'so',
    た: 'ta',
    ち: 'chi',
    つ: 'tsu',
    て: 'te',
    と: 'to',
    な: 'na',
    に: 'ni',
    ぬ: 'nu',
    ね: 'ne',
    の: 'no',
    は: 'ha',
    ひ: 'hi',
    ふ: 'fu',
    へ: 'he',
    ほ: 'ho',
    ま: 'ma',
    み: 'mi',
    む: 'mu',
    め: 'me',
    も: 'mo',
    や: 'ya',
    ゆ: 'yu',
    よ: 'yo',
    ら: 'ra',
    り: 'ri',
    る: 'ru',
    れ: 're',
    ろ: 'ro',
    わ: 'wa',
    を: 'wo',
    ん: 'n',
    が: 'ga',
    ぎ: 'gi',
    ぐ: 'gu',
    げ: 'ge',
    ご: 'go',
    ざ: 'za',
    じ: 'ji',
    ず: 'zu',
    ぜ: 'ze',
    ぞ: 'zo',

    // Katakana
    ア: 'a',
    イ: 'i',
    ウ: 'u',
    エ: 'e',
    オ: 'o',
    カ: 'ka',
    キ: 'ki',
    ク: 'ku',
    ケ: 'ke',
    コ: 'ko',
    サ: 'sa',
    シ: 'shi',
    ス: 'su',
    セ: 'se',
    ソ: 'so',
    タ: 'ta',
    チ: 'chi',
    ツ: 'tsu',
    テ: 'te',
    ト: 'to',
    ナ: 'na',
    ニ: 'ni',
    ヌ: 'nu',
    ネ: 'ne',
    ノ: 'no',
    ハ: 'ha',
    ヒ: 'hi',
    フ: 'fu',
    ヘ: 'he',
    ホ: 'ho',
    マ: 'ma',
    ミ: 'mi',
    ム: 'mu',
    メ: 'me',
    モ: 'mo',
    ヤ: 'ya',
    ユ: 'yu',
    ヨ: 'yo',
    ラ: 'ra',
    リ: 'ri',
    ル: 'ru',
    レ: 're',
    ロ: 'ro',
    ワ: 'wa',
    ヲ: 'wo',
    ン: 'n',
    ガ: 'ga',
    ギ: 'gi',
    グ: 'gu',
    ゲ: 'ge',
    ゴ: 'go',
    ザ: 'za',
    ジ: 'ji',
    ズ: 'zu',
    ゼ: 'ze',
    ゾ: 'zo',
};

// ============================================================================
// HELPERS
// ============================================================================

const getKanaColors = (mode: 'hiragana' | 'katakana') => {
    if (mode === 'hiragana') {
        return colors.levels.n5;
    }
    return colors.levels.n4;
};

// ============================================================================
// COMPONENTES
// ============================================================================

const ModeSelector = ({
    mode,
    onSelect,
}: {
    mode: 'animation' | 'writing';
    onSelect: (mode: 'animation' | 'writing') => void;
}) => {
    const selectorWidth = (width - spacing.screen * 2 - spacing.xs * 2) / 2;
    const translateX = useRef(
        new RNAnimated.Value(mode === 'animation' ? 0 : selectorWidth)
    ).current;

    useEffect(() => {
        const targetX = mode === 'animation' ? 0 : selectorWidth;
        RNAnimated.timing(translateX, {
            toValue: targetX,
            duration: 120,
            useNativeDriver: true,
        }).start();
    }, [mode, selectorWidth]);

    const indicatorColor =
        mode === 'animation'
            ? colors.levels.n5.primary
            : colors.levels.n4.primary;

    return (
        <View style={styles.selector}>
            <RNAnimated.View
                style={[
                    styles.selectorIndicator,
                    {
                        width: selectorWidth,
                        backgroundColor: indicatorColor,
                        transform: [{ translateX }],
                    },
                ]}
            />

            <Pressable
                onPress={() => onSelect('animation')}
                style={styles.selectorOption}
            >
                <Text
                    style={[
                        styles.selectorText,
                        mode === 'animation' && styles.selectorTextActive,
                    ]}
                >
                    アニメ
                </Text>
            </Pressable>

            <Pressable
                onPress={() => onSelect('writing')}
                style={styles.selectorOption}
            >
                <Text
                    style={[
                        styles.selectorText,
                        mode === 'writing' && styles.selectorTextActive,
                    ]}
                >
                    書く
                </Text>
            </Pressable>
        </View>
    );
};

// ============================================================================
// PANTALLA
// ============================================================================

export default function KanaPractice() {
    const params = useLocalSearchParams();
    const char =
        (Array.isArray(params.char) ? params.char[0] : params.char) || 'あ';
    const kanaMode =
        ((Array.isArray(params.mode) ? params.mode[0] : params.mode) as
            | 'hiragana'
            | 'katakana') || 'hiragana';

    const [practiceMode, setPracticeMode] = useState<'animation' | 'writing'>(
        'animation'
    );
    const [strokes, setStrokes] = useState<string[]>([]);
    const [strokeWidth, setStrokeWidth] = useState<number>(6);
    const [loading, setLoading] = useState(true);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const kanaColors = getKanaColors(kanaMode);
    const componentSize = width - spacing.screen * 2;

    // Audio setup
    const soundKey = CHAR_TO_SOUND[char];
    const hasAudio = Boolean(soundKey && soundKey in AUDIO_FILES);
    const audioSource = hasAudio ? AUDIO_FILES[soundKey] : null;
    const player = useAudioPlayer(audioSource);

    // Load strokes
    useEffect(() => {
        setLoading(true);
        try {
            const result = loadStrokesWithMetadata(char, SVG_REGISTRY);
            setStrokes(result.strokes);
            setStrokeWidth(result.strokeWidth);
        } catch (error) {
            console.error('Error loading strokes:', error);
        } finally {
            setLoading(false);
        }
    }, [char]);

    // Audio playback monitoring
    useEffect(() => {
        if (!player || !hasAudio) return;

        let checkInterval: ReturnType<typeof setInterval> | null = null;

        if (isPlayingAudio) {
            checkInterval = setInterval(() => {
                if (!player.playing) {
                    setIsPlayingAudio(false);
                    if (checkInterval) clearInterval(checkInterval);
                }
            }, 100);
        }

        return () => {
            if (checkInterval) clearInterval(checkInterval);
        };
    }, [player, hasAudio, isPlayingAudio]);

    const playAudio = async () => {
        if (!hasAudio || isPlayingAudio || !player) return;

        try {
            setIsPlayingAudio(true);
            player.seekTo(0);
            player.play();
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlayingAudio(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                {/* Selector de modo */}
                <View style={styles.selectorContainer}>
                    <ModeSelector
                        mode={practiceMode}
                        onSelect={setPracticeMode}
                    />
                </View>

                {/* Contenido según el modo */}
                <View style={styles.practiceContainer}>
                    {loading ? (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ActivityIndicator
                                size="large"
                                color={kanaColors.primary}
                            />
                        </View>
                    ) : strokes.length === 0 ? (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 40,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'NotoSansJP_400Regular',
                                    fontSize: 16,
                                    color: colors.text.secondary,
                                    textAlign: 'center',
                                }}
                            >
                                No hay datos de trazos para este carácter.
                            </Text>
                        </View>
                    ) : practiceMode === 'animation' ? (
                        <KanaAnimation
                            strokes={strokes}
                            size={componentSize}
                            strokeWidth={strokeWidth}
                            hasAudio={hasAudio}
                            isPlayingAudio={isPlayingAudio}
                            onPlayAudio={playAudio}
                        />
                    ) : (
                        <KanaWriting
                            strokes={strokes}
                            size={componentSize}
                            strokeWidth={strokeWidth}
                            hasAudio={hasAudio}
                            isPlayingAudio={isPlayingAudio}
                            onPlayAudio={playAudio}
                        />
                    )}
                </View>
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

    // Práctica
    practiceContainer: {
        flex: 1,
        paddingHorizontal: spacing.screen,
    },
});
