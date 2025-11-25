import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, TouchableRipple, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// --- ESTRUCTURA DE DATOS ---

type KanaChar = { char: string; romaji: string };
type KanaGroup = { title: string; data: KanaChar[] };

const HIRAGANA_DATA: KanaGroup[] = [
  {
    title: '清音', // Seion
    data: [
      { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
      { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
      { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
      { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
      { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
      { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
      { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
      { char: 'や', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ゆ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'よ', romaji: 'yo' },
      { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
      { char: 'わ', romaji: 'wa' }, { char: '', romaji: '' }, { char: 'を', romaji: 'wo' }, { char: '', romaji: '' }, { char: 'ん', romaji: 'n' },
    ]
  },
  {
    title: '濁音', // Dakuon
    data: [
      { char: 'が', romaji: 'ga' }, { char: 'ぎ', romaji: 'gi' }, { char: 'ぐ', romaji: 'gu' }, { char: 'げ', romaji: 'ge' }, { char: 'ご', romaji: 'go' },
      { char: 'ざ', romaji: 'za' }, { char: 'じ', romaji: 'ji' }, { char: 'ず', romaji: 'zu' }, { char: 'ぜ', romaji: 'ze' }, { char: 'ぞ', romaji: 'zo' },
      { char: 'だ', romaji: 'da' }, { char: 'ぢ', romaji: 'ji' }, { char: 'づ', romaji: 'zu' }, { char: 'で', romaji: 'de' }, { char: 'ど', romaji: 'do' },
      { char: 'ば', romaji: 'ba' }, { char: 'び', romaji: 'bi' }, { char: 'ぶ', romaji: 'bu' }, { char: 'べ', romaji: 'be' }, { char: 'ぼ', romaji: 'bo' },
    ]
  },
  {
    title: '半濁音', // Handakuon
    data: [
      { char: 'ぱ', romaji: 'pa' }, { char: 'ぴ', romaji: 'pi' }, { char: 'ぷ', romaji: 'pu' }, { char: 'ぺ', romaji: 'pe' }, { char: 'ぽ', romaji: 'po' },
    ]
  },
  {
    title: '拗音', // Yoon
    data: [
      { char: 'きゃ', romaji: 'kya' }, { char: 'きゅ', romaji: 'kyu' }, { char: 'きょ', romaji: 'kyo' },
      { char: 'しゃ', romaji: 'sha' }, { char: 'しゅ', romaji: 'shu' }, { char: 'しょ', romaji: 'sho' },
      { char: 'ちゃ', romaji: 'cha' }, { char: 'ちゅ', romaji: 'chu' }, { char: 'ちょ', romaji: 'cho' },
      { char: 'にゃ', romaji: 'nya' }, { char: 'にゅ', romaji: 'nyu' }, { char: 'にょ', romaji: 'nyo' },
      { char: 'ひゃ', romaji: 'hya' }, { char: 'ひゅ', romaji: 'hyu' }, { char: 'ひょ', romaji: 'hyo' },
      { char: 'みゃ', romaji: 'mya' }, { char: 'みゅ', romaji: 'myu' }, { char: 'みょ', romaji: 'myo' },
      { char: 'りゃ', romaji: 'rya' }, { char: 'りゅ', romaji: 'ryu' }, { char: 'りょ', romaji: 'ryo' },
      { char: 'ぎゃ', romaji: 'gya' }, { char: 'ぎゅ', romaji: 'gyu' }, { char: 'ぎょ', romaji: 'gyo' },
      { char: 'じゃ', romaji: 'ja' },  { char: 'じゅ', romaji: 'ju' },  { char: 'じょ', romaji: 'jo' },
      { char: 'びゃ', romaji: 'bya' }, { char: 'びゅ', romaji: 'byu' }, { char: 'びょ', romaji: 'byo' },
      { char: 'ぴゃ', romaji: 'pya' }, { char: 'ぴゅ', romaji: 'pyu' }, { char: 'ぴょ', romaji: 'pyo' },
    ]
  },
  {
    title: '促音', // Sokuon
    data: [
      { char: 'っ', romaji: 'tt' }
    ]
  }
];

const KATAKANA_DATA: KanaGroup[] = [
  {
    title: '清音', // Seion
    data: [
      { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
      { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
      { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
      { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
      { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
      { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
      { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
      { char: 'ヤ', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ユ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'ヨ', romaji: 'yo' },
      { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
      { char: 'ワ', romaji: 'wa' }, { char: '', romaji: '' }, { char: 'ヲ', romaji: 'wo' }, { char: '', romaji: '' }, { char: 'ン', romaji: 'n' },
    ]
  },
  {
    title: '濁音', // Dakuon
    data: [
      { char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' }, { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' },
      { char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' }, { char: 'ゼ', romaji: 'ze' }, { char: 'ゾ', romaji: 'zo' },
      { char: 'ダ', romaji: 'da' }, { char: 'ヂ', romaji: 'ji' }, { char: 'ヅ', romaji: 'zu' }, { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' },
      { char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' }, { char: 'ベ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' },
    ]
  },
  {
    title: '半濁音', // Handakuon
    data: [
      { char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' }, { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' },
    ]
  },
  {
    title: '拗音', // Yoon
    data: [
      { char: 'キャ', romaji: 'kya' }, { char: 'キュ', romaji: 'kyu' }, { char: 'キョ', romaji: 'kyo' },
      { char: 'シャ', romaji: 'sha' }, { char: 'シュ', romaji: 'shu' }, { char: 'ショ', romaji: 'sho' },
      { char: 'チャ', romaji: 'cha' }, { char: 'チュ', romaji: 'chu' }, { char: 'チョ', romaji: 'cho' },
      { char: 'ニャ', romaji: 'nya' }, { char: 'ニュ', romaji: 'nyu' }, { char: 'ニョ', romaji: 'nyo' },
      { char: 'ヒャ', romaji: 'hya' }, { char: 'ヒュ', romaji: 'hyu' }, { char: 'ヒョ', romaji: 'hyo' },
      { char: 'ミャ', romaji: 'mya' }, { char: 'ミュ', romaji: 'myu' }, { char: 'ミョ', romaji: 'myo' },
      { char: 'リャ', romaji: 'rya' }, { char: 'リュ', romaji: 'ryu' }, { char: 'リョ', romaji: 'ryo' },
      { char: 'ギャ', romaji: 'gya' }, { char: 'ギュ', romaji: 'gyu' }, { char: 'ギョ', romaji: 'gyo' },
      { char: 'ジャ', romaji: 'ja' },  { char: 'ジュ', romaji: 'ju' },  { char: 'ジョ', romaji: 'jo' },
      { char: 'ビャ', romaji: 'bya' }, { char: 'ビュ', romaji: 'byu' }, { char: 'ビョ', romaji: 'byo' },
      { char: 'ピャ', romaji: 'pya' }, { char: 'ピュ', romaji: 'pyu' }, { char: 'ピョ', romaji: 'pyo' },
    ]
  },
  {
    title: '促音', // Sokuon
    data: [
      { char: 'ッ', romaji: 'tt' }
    ]
  }
];

export default function KanaScreen() {
  const [mode, setMode] = useState<'hiragana' | 'katakana'>('hiragana');
  const router = useRouter();
  const { width } = Dimensions.get('window');
  
  const activeData = mode === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
  const activeColor = mode === 'hiragana' ? '#22c55e' : '#0ea5e9';

  // --- CONFIGURACIÓN DE LA GRILLA (3 COLUMNAS) ---
  const numColumns = 3;
  const gap = 12;
  const padding = 20;
  
  const availableWidth = width - (padding * 2) - (gap * (numColumns - 1));
  const cardWidth = availableWidth / numColumns;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAF9' }} edges={['top']}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER: SOLO TÍTULO CENTRADO */}
      <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
        <IconButton icon="arrow-left" iconColor="#1c1917" onPress={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', marginRight: 40 }}>
           <Text variant="headlineSmall" style={{ fontFamily: 'NotoSansJP_700Bold', color: '#1c1917' }}>
             仮名
           </Text>
        </View>
      </View>

      {/* SELECTOR DE MODO */}
      <View style={{ paddingHorizontal: padding, marginBottom: 16 }}>
        <Surface style={{ 
          flexDirection: 'row', 
          backgroundColor: '#e5e5e5', 
          borderRadius: 16, 
          padding: 4, 
          overflow: 'hidden'
        }} elevation={0} mode="flat">
          
          {/* Hiragana Toggle */}
          <TouchableRipple 
            onPress={() => setMode('hiragana')} 
            style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
          >
            <View style={{ 
              backgroundColor: mode === 'hiragana' ? 'white' : 'transparent',
              paddingVertical: 6,
              alignItems: 'center',
              borderRadius: 12,
              elevation: mode === 'hiragana' ? 1 : 0
            }}>
              <Text style={{ 
                fontFamily: 'NotoSansJP_700Bold', 
                color: mode === 'hiragana' ? '#22c55e' : '#78716c',
                fontSize: 16
              }}>
                ひらがな
              </Text>
            </View>
          </TouchableRipple>

          {/* Katakana Toggle */}
          <TouchableRipple 
            onPress={() => setMode('katakana')} 
            style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
          >
            <View style={{ 
              backgroundColor: mode === 'katakana' ? 'white' : 'transparent',
              paddingVertical: 6,
              alignItems: 'center',
              borderRadius: 12,
              elevation: mode === 'katakana' ? 1 : 0
            }}>
              <Text style={{ 
                fontFamily: 'NotoSansJP_700Bold', 
                color: mode === 'katakana' ? '#0ea5e9' : '#78716c',
                fontSize: 16
              }}>
                カタカナ
              </Text>
            </View>
          </TouchableRipple>

        </Surface>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: 40 }}>
        {activeData.map((group, groupIndex) => (
          <View key={groupIndex} style={{ marginBottom: 32 }}>
            
            <Text variant="titleMedium" style={{ fontFamily: 'NotoSansJP_700Bold', color: '#57534e', marginBottom: 16, marginLeft: 4 }}>
              {group.title}
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: gap }}>
              {group.data.map((item, index) => {
                if (!item.char) {
                  return <View key={index} style={{ width: cardWidth, height: cardWidth }} />;
                }

                return (
                  <Surface
                    key={index}
                    mode="flat"
                    style={{
                      width: cardWidth,
                      height: cardWidth,
                      borderRadius: 20,
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#e5e5e5',
                      overflow: 'hidden',
                    }}
                  >
                    <TouchableRipple 
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => {
                        // "as any" evita el error de tipado hasta que se regeneren las rutas
                        router.push({ pathname: '/modules/kana/practice/[char]' as any, params: { char: item.char } });
                      }}
                    >
                      <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <Text style={{ 
                          fontFamily: 'NotoSansJP_400Regular', 
                          fontSize: 42, 
                          color: '#1c1917',
                          lineHeight: 50
                        }}>
                          {item.char}
                        </Text>
                        <Text style={{ 
                          fontSize: 14, 
                          color: activeColor, 
                          fontWeight: 'bold',
                          marginTop: -4
                        }}>
                          {item.romaji}
                        </Text>
                      </View>
                    </TouchableRipple>
                  </Surface>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}