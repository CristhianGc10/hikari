// src/data/vocabDataPart2.ts
// Continuación de la base de datos del vocabulario JLPT N5

import { VocabWord } from './vocabData';

// ---------------------------------------------------------------------------
// 7. FECHAS (日付)
// ---------------------------------------------------------------------------
export const DATE_VOCAB: VocabWord[] = [
  { id: 'd001', japanese: '今日', reading: 'きょう', meaning: 'hoy', example: '今日は何曜日ですか。', exampleMeaning: '¿Qué día es hoy?' },
  { id: 'd002', japanese: '明日', reading: 'あした', meaning: 'mañana', example: '明日会いましょう。', exampleMeaning: 'Nos vemos mañana.' },
  { id: 'd003', japanese: '昨日', reading: 'きのう', meaning: 'ayer', example: '昨日映画を見ました。', exampleMeaning: 'Ayer vi una película.' },
  { id: 'd004', japanese: 'あさって', reading: 'あさって', meaning: 'pasado mañana', example: 'あさって出発します。', exampleMeaning: 'Partiré pasado mañana.' },
  { id: 'd005', japanese: 'おととい', reading: 'おととい', meaning: 'anteayer', example: 'おととい雨でした。', exampleMeaning: 'Anteayer llovió.' },
  { id: 'd006', japanese: '今年', reading: 'ことし', meaning: 'este año', example: '今年日本に行きます。', exampleMeaning: 'Iré a Japón este año.' },
  { id: 'd007', japanese: '来年', reading: 'らいねん', meaning: 'próximo año', example: '来年結婚します。', exampleMeaning: 'Me casaré el próximo año.' },
  { id: 'd008', japanese: '去年', reading: 'きょねん', meaning: 'año pasado', example: '去年東京に行きました。', exampleMeaning: 'Fui a Tokio el año pasado.' },
  { id: 'd009', japanese: 'おととし', reading: 'おととし', meaning: 'hace dos años', example: 'おととし大学を卒業しました。', exampleMeaning: 'Me gradué hace dos años.' },
  { id: 'd010', japanese: '再来年', reading: 'さらいねん', meaning: 'dentro de dos años', example: '再来年結婚します。', exampleMeaning: 'Me casaré dentro de dos años.' },
  { id: 'd011', japanese: '今週', reading: 'こんしゅう', meaning: 'esta semana', example: '今週は忙しいです。', exampleMeaning: 'Estoy ocupado esta semana.' },
  { id: 'd012', japanese: '来週', reading: 'らいしゅう', meaning: 'próxima semana', example: '来週テストがあります。', exampleMeaning: 'La próxima semana hay examen.' },
  { id: 'd013', japanese: '先週', reading: 'せんしゅう', meaning: 'semana pasada', example: '先週友達に会いました。', exampleMeaning: 'Vi a mi amigo la semana pasada.' },
  { id: 'd014', japanese: '今月', reading: 'こんげつ', meaning: 'este mes', example: '今月誕生日です。', exampleMeaning: 'Este mes es mi cumpleaños.' },
  { id: 'd015', japanese: '来月', reading: 'らいげつ', meaning: 'próximo mes', example: '来月旅行に行きます。', exampleMeaning: 'Iré de viaje el próximo mes.' },
  { id: 'd016', japanese: '先月', reading: 'せんげつ', meaning: 'mes pasado', example: '先月車を買いました。', exampleMeaning: 'Compré un carro el mes pasado.' },
  { id: 'd017', japanese: '一日', reading: 'ついたち', meaning: '1° del mes', example: '一日は休みです。', exampleMeaning: 'El primero es día libre.' },
  { id: 'd018', japanese: '二日', reading: 'ふつか', meaning: '2 del mes / 2 días', example: '二日間旅行しました。', exampleMeaning: 'Viajé por dos días.' },
  { id: 'd019', japanese: '三日', reading: 'みっか', meaning: '3 del mes / 3 días', example: '三日後に会いましょう。', exampleMeaning: 'Nos vemos en tres días.' },
  { id: 'd020', japanese: '四日', reading: 'よっか', meaning: '4 del mes / 4 días', example: '四日は何がありますか。', exampleMeaning: '¿Qué hay el día 4?' },
  { id: 'd021', japanese: '五日', reading: 'いつか', meaning: '5 del mes / 5 días', example: '五日に届きます。', exampleMeaning: 'Llegará el día 5.' },
  { id: 'd022', japanese: '六日', reading: 'むいか', meaning: '6 del mes / 6 días', example: '六日から休みです。', exampleMeaning: 'Las vacaciones empiezan el 6.' },
  { id: 'd023', japanese: '七日', reading: 'なのか', meaning: '7 del mes / 7 días', example: '一週間は七日です。', exampleMeaning: 'Una semana tiene 7 días.' },
  { id: 'd024', japanese: '八日', reading: 'ようか', meaning: '8 del mes / 8 días', example: '八日に会議があります。', exampleMeaning: 'Hay una reunión el día 8.' },
  { id: 'd025', japanese: '九日', reading: 'ここのか', meaning: '9 del mes / 9 días', example: '九日に届きます。', exampleMeaning: 'Llegará el día 9.' },
  { id: 'd026', japanese: '十日', reading: 'とおか', meaning: '10 del mes / 10 días', example: '十日かかります。', exampleMeaning: 'Tomará 10 días.' },
  { id: 'd027', japanese: '十四日', reading: 'じゅうよっか', meaning: '14 del mes', example: '十四日は何の日ですか。', exampleMeaning: '¿Qué día es el 14?' },
  { id: 'd028', japanese: '二十日', reading: 'はつか', meaning: '20 del mes', example: '二十日に届きます。', exampleMeaning: 'Llegará el día 20.' },
  { id: 'd029', japanese: '一週間', reading: 'いっしゅうかん', meaning: 'una semana', example: '一週間日本にいます。', exampleMeaning: 'Estaré en Japón una semana.' },
  { id: 'd030', japanese: '一か月', reading: 'いっかげつ', meaning: 'un mes', example: '一か月勉強しました。', exampleMeaning: 'Estudié por un mes.' },
];

// ---------------------------------------------------------------------------
// 8. TIEMPO (時間)
// ---------------------------------------------------------------------------
export const TIME_VOCAB: VocabWord[] = [
  { id: 'tm001', japanese: '～時', reading: '～じ', meaning: '~ en punto', example: '三時に会いましょう。', exampleMeaning: 'Nos vemos a las 3.' },
  { id: 'tm002', japanese: '～分', reading: '～ふん/ぷん', meaning: '~ minutos', example: '十分待ってください。', exampleMeaning: 'Espera 10 minutos.' },
  { id: 'tm003', japanese: '半', reading: 'はん', meaning: 'media (hora)', example: '三時半に行きます。', exampleMeaning: 'Iré a las 3:30.' },
  { id: 'tm004', japanese: '朝', reading: 'あさ', meaning: 'mañana', example: '朝起きます。', exampleMeaning: 'Me levanto en la mañana.' },
  { id: 'tm005', japanese: '昼', reading: 'ひる', meaning: 'mediodía', example: '昼ごはんを食べます。', exampleMeaning: 'Como el almuerzo.' },
  { id: 'tm006', japanese: '夜', reading: 'よる', meaning: 'noche', example: '夜テレビを見ます。', exampleMeaning: 'Veo televisión en la noche.' },
  { id: 'tm007', japanese: '夕方', reading: 'ゆうがた', meaning: 'atardecer', example: '夕方散歩します。', exampleMeaning: 'Paseo al atardecer.' },
  { id: 'tm008', japanese: '毎朝', reading: 'まいあさ', meaning: 'cada mañana', example: '毎朝コーヒーを飲みます。', exampleMeaning: 'Tomo café cada mañana.' },
  { id: 'tm009', japanese: '毎日', reading: 'まいにち', meaning: 'cada día', example: '毎日勉強します。', exampleMeaning: 'Estudio cada día.' },
  { id: 'tm010', japanese: '毎週', reading: 'まいしゅう', meaning: 'cada semana', example: '毎週日曜日は休みです。', exampleMeaning: 'Cada domingo es día libre.' },
  { id: 'tm011', japanese: '毎月', reading: 'まいつき', meaning: 'cada mes', example: '毎月旅行します。', exampleMeaning: 'Viajo cada mes.' },
  { id: 'tm012', japanese: '毎年', reading: 'まいとし', meaning: 'cada año', example: '毎年日本に行きます。', exampleMeaning: 'Voy a Japón cada año.' },
  { id: 'tm013', japanese: '毎晩', reading: 'まいばん', meaning: 'cada noche', example: '毎晩本を読みます。', exampleMeaning: 'Leo cada noche.' },
  { id: 'tm014', japanese: '春', reading: 'はる', meaning: 'primavera', example: '春は暖かいです。', exampleMeaning: 'La primavera es cálida.' },
  { id: 'tm015', japanese: '夏', reading: 'なつ', meaning: 'verano', example: '夏は暑いです。', exampleMeaning: 'El verano es caluroso.' },
  { id: 'tm016', japanese: '秋', reading: 'あき', meaning: 'otoño', example: '秋は涼しいです。', exampleMeaning: 'El otoño es fresco.' },
  { id: 'tm017', japanese: '冬', reading: 'ふゆ', meaning: 'invierno', example: '冬は寒いです。', exampleMeaning: 'El invierno es frío.' },
  { id: 'tm018', japanese: '月曜日', reading: 'げつようび', meaning: 'lunes', example: '月曜日は忙しいです。', exampleMeaning: 'Los lunes estoy ocupado.' },
  { id: 'tm019', japanese: '火曜日', reading: 'かようび', meaning: 'martes', example: '火曜日に会いましょう。', exampleMeaning: 'Nos vemos el martes.' },
  { id: 'tm020', japanese: '水曜日', reading: 'すいようび', meaning: 'miércoles', example: '水曜日は休みです。', exampleMeaning: 'El miércoles es día libre.' },
  { id: 'tm021', japanese: '木曜日', reading: 'もくようび', meaning: 'jueves', example: '木曜日にテストがあります。', exampleMeaning: 'Hay examen el jueves.' },
  { id: 'tm022', japanese: '金曜日', reading: 'きんようび', meaning: 'viernes', example: '金曜日は楽しいです。', exampleMeaning: 'Los viernes son divertidos.' },
  { id: 'tm023', japanese: '土曜日', reading: 'どようび', meaning: 'sábado', example: '土曜日に買い物をします。', exampleMeaning: 'Hago compras los sábados.' },
  { id: 'tm024', japanese: '日曜日', reading: 'にちようび', meaning: 'domingo', example: '日曜日は休みです。', exampleMeaning: 'Los domingos son día libre.' },
  { id: 'tm025', japanese: '今', reading: 'いま', meaning: 'ahora', example: '今何時ですか。', exampleMeaning: '¿Qué hora es ahora?' },
  { id: 'tm026', japanese: 'いつ', reading: 'いつ', meaning: '¿cuándo?', example: 'いつ日本に行きますか。', exampleMeaning: '¿Cuándo vas a Japón?' },
  { id: 'tm027', japanese: 'いつも', reading: 'いつも', meaning: 'siempre', example: 'いつも七時に起きます。', exampleMeaning: 'Siempre me levanto a las 7.' },
  { id: 'tm028', japanese: 'たいてい', reading: 'たいてい', meaning: 'generalmente', example: 'たいてい電車で行きます。', exampleMeaning: 'Generalmente voy en tren.' },
  { id: 'tm029', japanese: '時々', reading: 'ときどき', meaning: 'a veces', example: '時々映画を見ます。', exampleMeaning: 'A veces veo películas.' },
];

// ---------------------------------------------------------------------------
// 9. UBICACIÓN (位置)
// ---------------------------------------------------------------------------
export const LOCATION_VOCAB: VocabWord[] = [
  { id: 'lo001', japanese: '上', reading: 'うえ', meaning: 'arriba / encima', example: '机の上に本があります。', exampleMeaning: 'Hay un libro encima del escritorio.' },
  { id: 'lo002', japanese: '下', reading: 'した', meaning: 'abajo / debajo', example: '椅子の下に猫がいます。', exampleMeaning: 'Hay un gato debajo de la silla.' },
  { id: 'lo003', japanese: '前', reading: 'まえ', meaning: 'delante / antes', example: '駅の前にバス停があります。', exampleMeaning: 'Hay una parada de bus frente a la estación.' },
  { id: 'lo004', japanese: '後ろ', reading: 'うしろ', meaning: 'detrás', example: '学校の後ろに公園があります。', exampleMeaning: 'Hay un parque detrás de la escuela.' },
  { id: 'lo005', japanese: '右', reading: 'みぎ', meaning: 'derecha', example: '右に曲がってください。', exampleMeaning: 'Gire a la derecha.' },
  { id: 'lo006', japanese: '左', reading: 'ひだり', meaning: 'izquierda', example: '左に曲がってください。', exampleMeaning: 'Gire a la izquierda.' },
  { id: 'lo007', japanese: '中', reading: 'なか', meaning: 'dentro / adentro', example: 'かばんの中に財布があります。', exampleMeaning: 'Hay una cartera dentro del bolso.' },
  { id: 'lo008', japanese: '外', reading: 'そと', meaning: 'fuera / afuera', example: '外は寒いです。', exampleMeaning: 'Afuera hace frío.' },
  { id: 'lo009', japanese: '隣', reading: 'となり', meaning: 'al lado', example: '銀行の隣に郵便局があります。', exampleMeaning: 'Hay una oficina de correos al lado del banco.' },
  { id: 'lo010', japanese: '近く', reading: 'ちかく', meaning: 'cerca', example: '駅の近くに住んでいます。', exampleMeaning: 'Vivo cerca de la estación.' },
  { id: 'lo011', japanese: '間', reading: 'あいだ', meaning: 'entre', example: '銀行と郵便局の間にあります。', exampleMeaning: 'Está entre el banco y la oficina de correos.' },
  { id: 'lo012', japanese: 'そば', reading: 'そば', meaning: 'cerca / al lado', example: '駅のそばにコンビニがあります。', exampleMeaning: 'Hay una tienda cerca de la estación.' },
  { id: 'lo013', japanese: 'ここ', reading: 'ここ', meaning: 'aquí', example: 'ここに座ってください。', exampleMeaning: 'Siéntese aquí.' },
  { id: 'lo014', japanese: 'そこ', reading: 'そこ', meaning: 'ahí', example: 'そこに置いてください。', exampleMeaning: 'Ponlo ahí.' },
  { id: 'lo015', japanese: 'あそこ', reading: 'あそこ', meaning: 'allá', example: 'あそこに駅があります。', exampleMeaning: 'Allá está la estación.' },
  { id: 'lo016', japanese: 'どこ', reading: 'どこ', meaning: '¿dónde?', example: 'トイレはどこですか。', exampleMeaning: '¿Dónde está el baño?' },
  { id: 'lo017', japanese: '北', reading: 'きた', meaning: 'norte', example: '北に行きます。', exampleMeaning: 'Voy al norte.' },
  { id: 'lo018', japanese: '南', reading: 'みなみ', meaning: 'sur', example: '南は暖かいです。', exampleMeaning: 'El sur es cálido.' },
  { id: 'lo019', japanese: '東', reading: 'ひがし', meaning: 'este', example: '太陽は東から昇ります。', exampleMeaning: 'El sol sale por el este.' },
  { id: 'lo020', japanese: '西', reading: 'にし', meaning: 'oeste', example: '西に沈みます。', exampleMeaning: 'Se pone por el oeste.' },
];

// ---------------------------------------------------------------------------
// 10. LUGARES (施設)
// ---------------------------------------------------------------------------
export const FACILITY_VOCAB: VocabWord[] = [
  { id: 'fa001', japanese: '建物', reading: 'たてもの', meaning: 'edificio', example: 'あの建物は何ですか。', exampleMeaning: '¿Qué es ese edificio?' },
  { id: 'fa002', japanese: '道', reading: 'みち', meaning: 'camino / calle', example: 'この道をまっすぐ行ってください。', exampleMeaning: 'Siga recto por este camino.' },
  { id: 'fa003', japanese: '橋', reading: 'はし', meaning: 'puente', example: '橋を渡ります。', exampleMeaning: 'Cruzo el puente.' },
  { id: 'fa004', japanese: '会社', reading: 'かいしゃ', meaning: 'empresa / compañía', example: '会社に行きます。', exampleMeaning: 'Voy a la empresa.' },
  { id: 'fa005', japanese: '映画館', reading: 'えいがかん', meaning: 'cine', example: '映画館で映画を見ます。', exampleMeaning: 'Veo películas en el cine.' },
  { id: 'fa006', japanese: 'デパート', reading: 'デパート', meaning: 'tienda departamental', example: 'デパートで買い物をします。', exampleMeaning: 'Hago compras en la tienda departamental.' },
  { id: 'fa007', japanese: '店', reading: 'みせ', meaning: 'tienda', example: 'あの店は安いです。', exampleMeaning: 'Esa tienda es barata.' },
  { id: 'fa008', japanese: '本屋', reading: 'ほんや', meaning: 'librería', example: '本屋で本を買います。', exampleMeaning: 'Compro libros en la librería.' },
  { id: 'fa009', japanese: 'スーパー', reading: 'スーパー', meaning: 'supermercado', example: 'スーパーで野菜を買います。', exampleMeaning: 'Compro verduras en el supermercado.' },
  { id: 'fa010', japanese: 'コンビニ', reading: 'コンビニ', meaning: 'tienda de conveniencia', example: 'コンビニは便利です。', exampleMeaning: 'La tienda de conveniencia es conveniente.' },
  { id: 'fa011', japanese: 'レストラン', reading: 'レストラン', meaning: 'restaurante', example: 'レストランで食べます。', exampleMeaning: 'Como en el restaurante.' },
  { id: 'fa012', japanese: '喫茶店', reading: 'きっさてん', meaning: 'cafetería', example: '喫茶店でコーヒーを飲みます。', exampleMeaning: 'Tomo café en la cafetería.' },
  { id: 'fa013', japanese: '食堂', reading: 'しょくどう', meaning: 'comedor', example: '食堂で昼ご飯を食べます。', exampleMeaning: 'Almuerzo en el comedor.' },
  { id: 'fa014', japanese: '学校', reading: 'がっこう', meaning: 'escuela', example: '学校に行きます。', exampleMeaning: 'Voy a la escuela.' },
  { id: 'fa015', japanese: '小学校', reading: 'しょうがっこう', meaning: 'escuela primaria', example: '小学校で勉強しました。', exampleMeaning: 'Estudié en la escuela primaria.' },
  { id: 'fa016', japanese: '大学', reading: 'だいがく', meaning: 'universidad', example: '大学で経済を勉強しています。', exampleMeaning: 'Estudio economía en la universidad.' },
  { id: 'fa017', japanese: '図書館', reading: 'としょかん', meaning: 'biblioteca', example: '図書館で本を借りました。', exampleMeaning: 'Saqué un libro de la biblioteca.' },
  { id: 'fa018', japanese: '大使館', reading: 'たいしかん', meaning: 'embajada', example: '大使館に行きます。', exampleMeaning: 'Voy a la embajada.' },
  { id: 'fa019', japanese: 'ホテル', reading: 'ホテル', meaning: 'hotel', example: 'ホテルに泊まります。', exampleMeaning: 'Me hospedo en el hotel.' },
  { id: 'fa020', japanese: '郵便局', reading: 'ゆうびんきょく', meaning: 'oficina de correos', example: '郵便局で手紙を出します。', exampleMeaning: 'Envío cartas en la oficina de correos.' },
  { id: 'fa021', japanese: '銀行', reading: 'ぎんこう', meaning: 'banco', example: '銀行でお金を下ろします。', exampleMeaning: 'Retiro dinero en el banco.' },
  { id: 'fa022', japanese: '病院', reading: 'びょういん', meaning: 'hospital', example: '病院に行きます。', exampleMeaning: 'Voy al hospital.' },
  { id: 'fa023', japanese: 'プール', reading: 'プール', meaning: 'piscina', example: 'プールで泳ぎます。', exampleMeaning: 'Nado en la piscina.' },
  { id: 'fa024', japanese: '交番', reading: 'こうばん', meaning: 'caseta de policía', example: '交番で道を聞きました。', exampleMeaning: 'Pregunté direcciones en la caseta de policía.' },
  { id: 'fa025', japanese: '公園', reading: 'こうえん', meaning: 'parque', example: '公園で散歩します。', exampleMeaning: 'Paseo en el parque.' },
  { id: 'fa026', japanese: '駅', reading: 'えき', meaning: 'estación', example: '駅で電車に乗ります。', exampleMeaning: 'Tomo el tren en la estación.' },
  { id: 'fa027', japanese: '信号', reading: 'しんごう', meaning: 'semáforo', example: '信号を渡ります。', exampleMeaning: 'Cruzo en el semáforo.' },
  { id: 'fa028', japanese: 'バス停', reading: 'バスてい', meaning: 'parada de bus', example: 'バス停でバスを待ちます。', exampleMeaning: 'Espero el bus en la parada.' },
  { id: 'fa029', japanese: 'ビル', reading: 'ビル', meaning: 'edificio de oficinas', example: 'あのビルで働いています。', exampleMeaning: 'Trabajo en ese edificio.' },
  { id: 'fa030', japanese: '国', reading: 'くに', meaning: 'país', example: 'どの国から来ましたか。', exampleMeaning: '¿De qué país vienes?' },
  { id: 'fa031', japanese: '町', reading: 'まち', meaning: 'ciudad / pueblo', example: 'この町は静かです。', exampleMeaning: 'Este pueblo es tranquilo.' },
];

// ---------------------------------------------------------------------------
// 11. CUERPO (体)
// ---------------------------------------------------------------------------
export const BODY_VOCAB: VocabWord[] = [
  { id: 'b001', japanese: '体', reading: 'からだ', meaning: 'cuerpo', example: '体に気をつけてください。', exampleMeaning: 'Cuídate (tu cuerpo).' },
  { id: 'b002', japanese: '頭', reading: 'あたま', meaning: 'cabeza', example: '頭が痛いです。', exampleMeaning: 'Me duele la cabeza.' },
  { id: 'b003', japanese: '顔', reading: 'かお', meaning: 'cara', example: '顔を洗います。', exampleMeaning: 'Me lavo la cara.' },
  { id: 'b004', japanese: '目', reading: 'め', meaning: 'ojo', example: '目が大きいですね。', exampleMeaning: 'Tienes ojos grandes.' },
  { id: 'b005', japanese: '耳', reading: 'みみ', meaning: 'oreja', example: '耳が聞こえません。', exampleMeaning: 'No puedo oír.' },
  { id: 'b006', japanese: '鼻', reading: 'はな', meaning: 'nariz', example: '鼻が高いです。', exampleMeaning: 'Tiene la nariz alta.' },
  { id: 'b007', japanese: '口', reading: 'くち', meaning: 'boca', example: '口を開けてください。', exampleMeaning: 'Abre la boca.' },
  { id: 'b008', japanese: '歯', reading: 'は', meaning: 'diente', example: '歯を磨きます。', exampleMeaning: 'Me cepillo los dientes.' },
  { id: 'b009', japanese: '手', reading: 'て', meaning: 'mano', example: '手を洗ってください。', exampleMeaning: 'Lávate las manos.' },
  { id: 'b010', japanese: '足', reading: 'あし', meaning: 'pie / pierna', example: '足が痛いです。', exampleMeaning: 'Me duele el pie.' },
  { id: 'b011', japanese: 'おなか', reading: 'おなか', meaning: 'estómago', example: 'おなかがすきました。', exampleMeaning: 'Tengo hambre.' },
  { id: 'b012', japanese: '背', reading: 'せ', meaning: 'espalda / estatura', example: '背が高いですね。', exampleMeaning: 'Eres alto.' },
  { id: 'b013', japanese: '髪', reading: 'かみ', meaning: 'cabello', example: '髪を切りました。', exampleMeaning: 'Me corté el cabello.' },
  { id: 'b014', japanese: 'のど', reading: 'のど', meaning: 'garganta', example: 'のどが痛いです。', exampleMeaning: 'Me duele la garganta.' },
  { id: 'b015', japanese: '声', reading: 'こえ', meaning: 'voz', example: 'いい声ですね。', exampleMeaning: 'Tienes buena voz.' },
  { id: 'b016', japanese: '風邪', reading: 'かぜ', meaning: 'resfriado', example: '風邪をひきました。', exampleMeaning: 'Me resfrié.' },
  { id: 'b017', japanese: '薬', reading: 'くすり', meaning: 'medicina', example: '薬を飲みます。', exampleMeaning: 'Tomo medicina.' },
];

// ---------------------------------------------------------------------------
// 12. NATURALEZA (自然)
// ---------------------------------------------------------------------------
export const NATURE_VOCAB: VocabWord[] = [
  { id: 'n001', japanese: '天気', reading: 'てんき', meaning: 'clima', example: '今日の天気はいいですね。', exampleMeaning: 'El clima está bueno hoy.' },
  { id: 'n002', japanese: '雨', reading: 'あめ', meaning: 'lluvia', example: '雨が降っています。', exampleMeaning: 'Está lloviendo.' },
  { id: 'n003', japanese: '風', reading: 'かぜ', meaning: 'viento', example: '風が強いです。', exampleMeaning: 'El viento es fuerte.' },
  { id: 'n004', japanese: '雪', reading: 'ゆき', meaning: 'nieve', example: '雪が降りました。', exampleMeaning: 'Nevó.' },
  { id: 'n005', japanese: '晴れ', reading: 'はれ', meaning: 'despejado', example: '明日は晴れです。', exampleMeaning: 'Mañana estará despejado.' },
  { id: 'n006', japanese: 'くもり', reading: 'くもり', meaning: 'nublado', example: '今日はくもりです。', exampleMeaning: 'Hoy está nublado.' },
  { id: 'n007', japanese: '空', reading: 'そら', meaning: 'cielo', example: '空がきれいです。', exampleMeaning: 'El cielo está bonito.' },
  { id: 'n008', japanese: '山', reading: 'やま', meaning: 'montaña', example: '山に登ります。', exampleMeaning: 'Subo la montaña.' },
  { id: 'n009', japanese: '海', reading: 'うみ', meaning: 'mar', example: '海で泳ぎます。', exampleMeaning: 'Nado en el mar.' },
  { id: 'n010', japanese: '川', reading: 'かわ', meaning: 'río', example: '川で魚をつります。', exampleMeaning: 'Pesco en el río.' },
  { id: 'n011', japanese: '池', reading: 'いけ', meaning: 'estanque', example: '池に魚がいます。', exampleMeaning: 'Hay peces en el estanque.' },
  { id: 'n012', japanese: '動物', reading: 'どうぶつ', meaning: 'animal', example: '動物が好きです。', exampleMeaning: 'Me gustan los animales.' },
  { id: 'n013', japanese: '犬', reading: 'いぬ', meaning: 'perro', example: '犬を飼っています。', exampleMeaning: 'Tengo un perro.' },
  { id: 'n014', japanese: '猫', reading: 'ねこ', meaning: 'gato', example: '猫がいます。', exampleMeaning: 'Hay un gato.' },
  { id: 'n015', japanese: '鳥', reading: 'とり', meaning: 'pájaro', example: '鳥が飛んでいます。', exampleMeaning: 'El pájaro está volando.' },
  { id: 'n016', japanese: '木', reading: 'き', meaning: 'árbol', example: '木の下で休みます。', exampleMeaning: 'Descanso bajo el árbol.' },
  { id: 'n017', japanese: '花', reading: 'はな', meaning: 'flor', example: '花がきれいです。', exampleMeaning: 'Las flores son bonitas.' },
  { id: 'n018', japanese: '島', reading: 'しま', meaning: 'isla', example: '島に行きたいです。', exampleMeaning: 'Quiero ir a la isla.' },
];

export default {
  DATE_VOCAB,
  TIME_VOCAB,
  LOCATION_VOCAB,
  FACILITY_VOCAB,
  BODY_VOCAB,
  NATURE_VOCAB,
};