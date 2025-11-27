// app/modules/kana/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Dimensions, Animated, Pressable } from 'react-native';
import { Text, Surface, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Color base del módulo (N5)
const THEME_COLOR = '#F5A238';

// Colores diferenciados para Hiragana y Katakana
// Hiragana: tonos cálidos coral/rosa suave que armonizan con el naranja
const HIRAGANA_CARD_BG = '#FFF5F5';
const HIRAGANA_CARD_TEXT = '#C94C4C';
const HIRAGANA_RIPPLE = '#E8787820';

// Katakana: tonos azul/índigo suave que contrastan elegantemente
const KATAKANA_CARD_BG = '#F0F4FF';
const KATAKANA_CARD_TEXT = '#5B6DAF';
const KATAKANA_RIPPLE = '#5B6DAF20';

type KanaChar = { char: string; romaji: string };
type KanaGroup = { title: string; data: KanaChar[] };

const HIRAGANA_DATA: KanaGroup[] = [
  {
    title: '清音',
    data: [
      { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
      { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
      { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
      { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
      { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
      { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
      { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
      { char: 'や', romaji: 'ya' }, { char: 'ゆ', romaji: 'yu' }, { char: 'よ', romaji: 'yo' },
      { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
      { char: 'わ', romaji: 'wa' }, { char: 'を', romaji: 'wo' }, { char: 'ん', romaji: 'n' },
    ]
  },
  {
    title: '濁音',
    data: [
      { char: 'が', romaji: 'ga' }, { char: 'ぎ', romaji: 'gi' }, { char: 'ぐ', romaji: 'gu' }, { char: 'げ', romaji: 'ge' }, { char: 'ご', romaji: 'go' },
      { char: 'ざ', romaji: 'za' }, { char: 'じ', romaji: 'ji' }, { char: 'ず', romaji: 'zu' }, { char: 'ぜ', romaji: 'ze' }, { char: 'ぞ', romaji: 'zo' },
      { char: 'だ', romaji: 'da' }, { char: 'ぢ', romaji: 'ji' }, { char: 'づ', romaji: 'zu' }, { char: 'で', romaji: 'de' }, { char: 'ど', romaji: 'do' },
      { char: 'ば', romaji: 'ba' }, { char: 'び', romaji: 'bi' }, { char: 'ぶ', romaji: 'bu' }, { char: 'べ', romaji: 'be' }, { char: 'ぼ', romaji: 'bo' },
    ]
  },
  {
    title: '半濁音',
    data: [
      { char: 'ぱ', romaji: 'pa' }, { char: 'ぴ', romaji: 'pi' }, { char: 'ぷ', romaji: 'pu' }, { char: 'ぺ', romaji: 'pe' }, { char: 'ぽ', romaji: 'po' },
    ]
  },
  {
    title: '拗音',
    data: [
      { char: 'きゃ', romaji: 'kya' }, { char: 'きゅ', romaji: 'kyu' }, { char: 'きょ', romaji: 'kyo' },
      { char: 'しゃ', romaji: 'sha' }, { char: 'しゅ', romaji: 'shu' }, { char: 'しょ', romaji: 'sho' },
      { char: 'ちゃ', romaji: 'cha' }, { char: 'ちゅ', romaji: 'chu' }, { char: 'ちょ', romaji: 'cho' },
      { char: 'にゃ', romaji: 'nya' }, { char: 'にゅ', romaji: 'nyu' }, { char: 'にょ', romaji: 'nyo' },
      { char: 'ひゃ', romaji: 'hya' }, { char: 'ひゅ', romaji: 'hyu' }, { char: 'ひょ', romaji: 'hyo' },
      { char: 'みゃ', romaji: 'mya' }, { char: 'みゅ', romaji: 'myu' }, { char: 'みょ', romaji: 'myo' },
      { char: 'りゃ', romaji: 'rya' }, { char: 'りゅ', romaji: 'ryu' }, { char: 'りょ', romaji: 'ryo' },
      { char: 'ぎゃ', romaji: 'gya' }, { char: 'ぎゅ', romaji: 'gyu' }, { char: 'ぎょ', romaji: 'gyo' },
      { char: 'じゃ', romaji: 'ja' }, { char: 'じゅ', romaji: 'ju' }, { char: 'じょ', romaji: 'jo' },
      { char: 'びゃ', romaji: 'bya' }, { char: 'びゅ', romaji: 'byu' }, { char: 'びょ', romaji: 'byo' },
      { char: 'ぴゃ', romaji: 'pya' }, { char: 'ぴゅ', romaji: 'pyu' }, { char: 'ぴょ', romaji: 'pyo' },
    ]
  },
  {
    title: '促音',
    data: [
      { char: 'っ', romaji: 'tt' }
    ]
  }
];

const KATAKANA_DATA: KanaGroup[] = [
  {
    title: '清音',
    data: [
      { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
      { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
      { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
      { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
      { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
      { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
      { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
      { char: 'ヤ', romaji: 'ya' }, { char: 'ユ', romaji: 'yu' }, { char: 'ヨ', romaji: 'yo' },
      { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
      { char: 'ワ', romaji: 'wa' }, { char: 'ヲ', romaji: 'wo' }, { char: 'ン', romaji: 'n' },
    ]
  },
  {
    title: '濁音',
    data: [
      { char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' }, { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' },
      { char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' }, { char: 'ゼ', romaji: 'ze' }, { char: 'ゾ', romaji: 'zo' },
      { char: 'ダ', romaji: 'da' }, { char: 'ヂ', romaji: 'ji' }, { char: 'ヅ', romaji: 'zu' }, { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' },
      { char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' }, { char: 'ベ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' },
    ]
  },
  {
    title: '半濁音',
    data: [
      { char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' }, { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' },
    ]
  },
  {
    title: '拗音',
    data: [
      { char: 'キャ', romaji: 'kya' }, { char: 'キュ', romaji: 'kyu' }, { char: 'キョ', romaji: 'kyo' },
      { char: 'シャ', romaji: 'sha' }, { char: 'シュ', romaji: 'shu' }, { char: 'ショ', romaji: 'sho' },
      { char: 'チャ', romaji: 'cha' }, { char: 'チュ', romaji: 'chu' }, { char: 'チョ', romaji: 'cho' },
      { char: 'ニャ', romaji: 'nya' }, { char: 'ニュ', romaji: 'nyu' }, { char: 'ニョ', romaji: 'nyo' },
      { char: 'ヒャ', romaji: 'hya' }, { char: 'ヒュ', romaji: 'hyu' }, { char: 'ヒョ', romaji: 'hyo' },
      { char: 'ミャ', romaji: 'mya' }, { char: 'ミュ', romaji: 'myu' }, { char: 'ミョ', romaji: 'myo' },
      { char: 'リャ', romaji: 'rya' }, { char: 'リュ', romaji: 'ryu' }, { char: 'リョ', romaji: 'ryo' },
      { char: 'ギャ', romaji: 'gya' }, { char: 'ギュ', romaji: 'gyu' }, { char: 'ギョ', romaji: 'gyo' },
      { char: 'ジャ', romaji: 'ja' }, { char: 'ジュ', romaji: 'ju' }, { char: 'ジョ', romaji: 'jo' },
      { char: 'ビャ', romaji: 'bya' }, { char: 'ビュ', romaji: 'byu' }, { char: 'ビョ', romaji: 'byo' },
      { char: 'ピャ', romaji: 'pya' }, { char: 'ピュ', romaji: 'pyu' }, { char: 'ピョ', romaji: 'pyo' },
    ]
  },
  {
    title: '促音',
    data: [
      { char: 'ッ', romaji: 'tt' }
    ]
  }
];

// Grid de 3 columnas
const PADDING = 20;
const GAP = 12;
const NUM_COLUMNS = 3;
const CARD_WIDTH = (width - PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export default function KanaScreen() {
  const [mode, setMode] = useState<'hiragana' | 'katakana'>('hiragana');
  const router = useRouter();
  
  // Animación del selector
  const slideAnim = useRef(new Animated.Value(0)).current;
  const selectorWidth = (width - PADDING * 2 - 8) / 2; // Ancho de cada mitad (restando padding del contenedor)
  
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: mode === 'hiragana' ? 0 : selectorWidth,
      useNativeDriver: true,
      tension: 100,
      friction: 12,
    }).start();
  }, [mode]);
  
  const activeData = mode === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
  
  // Colores dinámicos según el modo
  const cardBg = mode === 'hiragana' ? HIRAGANA_CARD_BG : KATAKANA_CARD_BG;
  const cardText = mode === 'hiragana' ? HIRAGANA_CARD_TEXT : KATAKANA_CARD_TEXT;
  const cardRipple = mode === 'hiragana' ? HIRAGANA_RIPPLE : KATAKANA_RIPPLE;

  const handleCharPress = (char: string) => {
    if (char) {
      router.push(`/modules/kana/practice/${encodeURIComponent(char)}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Selector Hiragana/Katakana - Con animación */}
      <View style={{ paddingHorizontal: PADDING, paddingTop: 10, marginBottom: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            borderRadius: 10,
            padding: 4,
            position: 'relative',
          }}
        >
          {/* Selector animado (fondo blanco que se desliza) */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 4,
              bottom: 4,
              left: 4,
              width: '50%',
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              transform: [{ translateX: slideAnim }],
              // Sombra sutil para el selector
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          />

          {/* Botón Hiragana */}
          <Pressable
            onPress={() => setMode('hiragana')}
            style={{ flex: 1, zIndex: 1 }}
          >
            <View
              style={{
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: 'NotoSansJP_700Bold',
                  fontSize: 18,
                  color: mode === 'hiragana' ? HIRAGANA_CARD_TEXT : '#9CA3AF',
                }}
              >
                ひらがな
              </Text>
            </View>
          </Pressable>

          {/* Botón Katakana */}
          <Pressable
            onPress={() => setMode('katakana')}
            style={{ flex: 1, zIndex: 1 }}
          >
            <View
              style={{
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: 'NotoSansJP_700Bold',
                  fontSize: 18,
                  color: mode === 'katakana' ? KATAKANA_CARD_TEXT : '#9CA3AF',
                }}
              >
                カタカナ
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Grid de Kana */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: PADDING, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {activeData.map((group, groupIndex) => (
          <View key={groupIndex} style={{ marginBottom: 24 }}>
            {/* Título del grupo */}
            <Text
              style={{
                fontFamily: 'NotoSansJP_400Regular',
                fontSize: 18,
                color: '#6B7280',
                marginBottom: 12,
              }}
            >
              {group.title}
            </Text>

            {/* Grid 3 columnas */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
              {group.data.map((kana, index) => (
                <KanaCard
                  key={index}
                  kana={kana}
                  cardBg={cardBg}
                  cardText={cardText}
                  cardRipple={cardRipple}
                  onPress={() => handleCharPress(kana.char)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

type KanaCardProps = {
  kana: KanaChar;
  cardBg: string;
  cardText: string;
  cardRipple: string;
  onPress: () => void;
};

const KanaCard = ({ kana, cardBg, cardText, cardRipple, onPress }: KanaCardProps) => {
  if (!kana.char) return <View style={{ width: CARD_WIDTH }} />;

  return (
    <Surface
      style={{
        width: CARD_WIDTH,
        aspectRatio: 1,
        borderRadius: 20,
        backgroundColor: cardBg,
        overflow: 'hidden',
      }}
      elevation={0}
      mode="flat"
    >
      <TouchableRipple
        onPress={onPress}
        rippleColor={cardRipple}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'NotoSansJP_400Regular',
              fontSize: 36,
              color: cardText,
              includeFontPadding: false,
            }}
          >
            {kana.char}
          </Text>
        </View>
      </TouchableRipple>
    </Surface>
  );
};