// src/data/vocabData.ts
// Base de datos del vocabulario JLPT N5 (~800 palabras)

export type VocabWord = {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
  example?: string;
  exampleMeaning?: string;
  tags?: string[];
};

export type VocabCategory = {
  id: string;
  titleJp: string;
  titleEs: string;
  description?: string;
};

// Definición de categorías
export const VOCAB_CATEGORIES: VocabCategory[] = [
  { id: 'people', titleJp: '人', titleEs: 'Personas', description: 'Familia, pronombres y relaciones' },
  { id: 'food', titleJp: '食べ物', titleEs: 'Comida', description: 'Alimentos, bebidas y utensilios' },
  { id: 'clothes', titleJp: '服', titleEs: 'Ropa', description: 'Vestimenta y accesorios' },
  { id: 'house', titleJp: '家', titleEs: 'Casa', description: 'Habitaciones y muebles' },
  { id: 'vehicle', titleJp: '乗り物', titleEs: 'Transporte', description: 'Vehículos y medios de transporte' },
  { id: 'tools', titleJp: '道具', titleEs: 'Herramientas', description: 'Objetos cotidianos y electrónicos' },
  { id: 'date', titleJp: '日付', titleEs: 'Fechas', description: 'Días, meses y expresiones temporales' },
  { id: 'time', titleJp: '時間', titleEs: 'Tiempo', description: 'Horas, estaciones y frecuencia' },
  { id: 'location', titleJp: '位置', titleEs: 'Ubicación', description: 'Direcciones y posiciones' },
  { id: 'facility', titleJp: '施設', titleEs: 'Lugares', description: 'Edificios y establecimientos' },
  { id: 'body', titleJp: '体', titleEs: 'Cuerpo', description: 'Partes del cuerpo y salud' },
  { id: 'nature', titleJp: '自然', titleEs: 'Naturaleza', description: 'Clima, animales y plantas' },
  { id: 'condition', titleJp: '状態', titleEs: 'Estados', description: 'Adverbios y condiciones' },
  { id: 'work', titleJp: '仕事', titleEs: 'Trabajo y Estudio', description: 'Profesiones y educación' },
  { id: 'adjectives', titleJp: '形容詞', titleEs: 'Adjetivos', description: 'Descripciones y cualidades' },
  { id: 'verbs', titleJp: '動詞', titleEs: 'Verbos', description: 'Acciones básicas' },
  { id: 'numbers', titleJp: '数字', titleEs: 'Números', description: 'Números y contadores' },
];

// Función helper para obtener categoría por ID
export const getCategoryById = (id: string): VocabCategory | undefined => {
  return VOCAB_CATEGORIES.find(cat => cat.id === id);
};

// =============================================================================
// DATOS DE VOCABULARIO POR CATEGORÍA
// =============================================================================

export const VOCAB_DATA: Record<string, VocabWord[]> = {
  // ---------------------------------------------------------------------------
  // 1. PERSONAS (人)
  // ---------------------------------------------------------------------------
  people: [
    { id: 'p001', japanese: '人', reading: 'ひと', meaning: 'persona, gente', example: 'あの人は先生です。', exampleMeaning: 'Esa persona es profesor.' },
    { id: 'p002', japanese: '私', reading: 'わたし', meaning: 'yo', example: '私は学生です。', exampleMeaning: 'Soy estudiante.' },
    { id: 'p003', japanese: '私たち', reading: 'わたしたち', meaning: 'nosotros', example: '私たちは日本人です。', exampleMeaning: 'Somos japoneses.' },
    { id: 'p004', japanese: 'あなた', reading: 'あなた', meaning: 'tú, usted', example: 'あなたは何歳ですか。', exampleMeaning: '¿Cuántos años tienes?' },
    { id: 'p005', japanese: '父', reading: 'ちち', meaning: 'mi padre', example: '父は会社員です。', exampleMeaning: 'Mi padre es empleado de oficina.' },
    { id: 'p006', japanese: '母', reading: 'はは', meaning: 'mi madre', example: '母は料理が上手です。', exampleMeaning: 'Mi madre es buena cocinando.' },
    { id: 'p007', japanese: 'お父さん', reading: 'おとうさん', meaning: 'padre (de otros)', example: 'お父さんはお元気ですか。', exampleMeaning: '¿Cómo está su padre?' },
    { id: 'p008', japanese: 'お母さん', reading: 'おかあさん', meaning: 'madre (de otros)', example: 'お母さんはどこにいますか。', exampleMeaning: '¿Dónde está su madre?' },
    { id: 'p009', japanese: '兄', reading: 'あに', meaning: 'mi hermano mayor', example: '兄は大学生です。', exampleMeaning: 'Mi hermano mayor es universitario.' },
    { id: 'p010', japanese: '姉', reading: 'あね', meaning: 'mi hermana mayor', example: '姉は東京に住んでいます。', exampleMeaning: 'Mi hermana mayor vive en Tokio.' },
    { id: 'p011', japanese: '弟', reading: 'おとうと', meaning: 'mi hermano menor', example: '弟は高校生です。', exampleMeaning: 'Mi hermano menor es estudiante de preparatoria.' },
    { id: 'p012', japanese: '妹', reading: 'いもうと', meaning: 'mi hermana menor', example: '妹は十歳です。', exampleMeaning: 'Mi hermana menor tiene 10 años.' },
    { id: 'p013', japanese: 'お兄さん', reading: 'おにいさん', meaning: 'hermano mayor (de otros)', example: 'お兄さんは何をしていますか。', exampleMeaning: '¿Qué hace su hermano mayor?' },
    { id: 'p014', japanese: 'お姉さん', reading: 'おねえさん', meaning: 'hermana mayor (de otros)', example: 'お姉さんはきれいですね。', exampleMeaning: 'Su hermana mayor es bonita.' },
    { id: 'p015', japanese: '弟さん', reading: 'おとうとさん', meaning: 'hermano menor (de otros)', example: '弟さんは元気ですか。', exampleMeaning: '¿Cómo está su hermano menor?' },
    { id: 'p016', japanese: '妹さん', reading: 'いもうとさん', meaning: 'hermana menor (de otros)', example: '妹さんは学生ですか。', exampleMeaning: '¿Su hermana menor es estudiante?' },
    { id: 'p017', japanese: '祖父', reading: 'そふ', meaning: 'mi abuelo', example: '祖父は八十歳です。', exampleMeaning: 'Mi abuelo tiene 80 años.' },
    { id: 'p018', japanese: '祖母', reading: 'そぼ', meaning: 'mi abuela', example: '祖母は料理が好きです。', exampleMeaning: 'A mi abuela le gusta cocinar.' },
    { id: 'p019', japanese: 'おじいさん', reading: 'おじいさん', meaning: 'abuelo (de otros)', example: 'おじいさんはお元気ですか。', exampleMeaning: '¿Cómo está su abuelo?' },
    { id: 'p020', japanese: 'おばあさん', reading: 'おばあさん', meaning: 'abuela (de otros)', example: 'おばあさんはどこにいますか。', exampleMeaning: '¿Dónde está su abuela?' },
    { id: 'p021', japanese: '夫', reading: 'おっと', meaning: 'mi esposo', example: '夫は医者です。', exampleMeaning: 'Mi esposo es médico.' },
    { id: 'p022', japanese: '妻', reading: 'つま', meaning: 'mi esposa', example: '妻は先生です。', exampleMeaning: 'Mi esposa es profesora.' },
    { id: 'p023', japanese: 'ご主人', reading: 'ごしゅじん', meaning: 'esposo (de otros)', example: 'ご主人はどちらにいますか。', exampleMeaning: '¿Dónde está su esposo?' },
    { id: 'p024', japanese: '奥さん', reading: 'おくさん', meaning: 'esposa (de otros)', example: '奥さんはお元気ですか。', exampleMeaning: '¿Cómo está su esposa?' },
    { id: 'p025', japanese: '息子', reading: 'むすこ', meaning: 'mi hijo', example: '息子は五歳です。', exampleMeaning: 'Mi hijo tiene 5 años.' },
    { id: 'p026', japanese: '娘', reading: 'むすめ', meaning: 'mi hija', example: '娘は三歳です。', exampleMeaning: 'Mi hija tiene 3 años.' },
    { id: 'p027', japanese: '息子さん', reading: 'むすこさん', meaning: 'hijo (de otros)', example: '息子さんはお元気ですか。', exampleMeaning: '¿Cómo está su hijo?' },
    { id: 'p028', japanese: '娘さん', reading: 'むすめさん', meaning: 'hija (de otros)', example: '娘さんはおいくつですか。', exampleMeaning: '¿Cuántos años tiene su hija?' },
    { id: 'p029', japanese: 'おじ', reading: 'おじ', meaning: 'mi tío', example: 'おじは大阪に住んでいます。', exampleMeaning: 'Mi tío vive en Osaka.' },
    { id: 'p030', japanese: 'おば', reading: 'おば', meaning: 'mi tía', example: 'おばは看護師です。', exampleMeaning: 'Mi tía es enfermera.' },
    { id: 'p031', japanese: 'おじさん', reading: 'おじさん', meaning: 'tío (de otros) / señor', example: 'おじさんはどこにいますか。', exampleMeaning: '¿Dónde está su tío?' },
    { id: 'p032', japanese: 'おばさん', reading: 'おばさん', meaning: 'tía (de otros) / señora', example: 'おばさんは優しいです。', exampleMeaning: 'Su tía es amable.' },
    { id: 'p033', japanese: '子ども', reading: 'こども', meaning: 'niño(s), hijo(s)', example: '子どもは公園で遊んでいます。', exampleMeaning: 'Los niños juegan en el parque.' },
    { id: 'p034', japanese: 'お子さん', reading: 'おこさん', meaning: 'hijo(s) (de otros)', example: 'お子さんはおいくつですか。', exampleMeaning: '¿Cuántos años tiene su hijo?' },
    { id: 'p035', japanese: '一人っ子', reading: 'ひとりっこ', meaning: 'hijo único', example: '私は一人っ子です。', exampleMeaning: 'Soy hijo único.' },
    { id: 'p036', japanese: '両親', reading: 'りょうしん', meaning: 'padres', example: '両親は元気です。', exampleMeaning: 'Mis padres están bien.' },
    { id: 'p037', japanese: '家族', reading: 'かぞく', meaning: 'familia', example: '家族は四人です。', exampleMeaning: 'Mi familia es de 4 personas.' },
    { id: 'p038', japanese: '兄弟', reading: 'きょうだい', meaning: 'hermanos', example: '兄弟はいますか。', exampleMeaning: '¿Tienes hermanos?' },
    { id: 'p039', japanese: 'いとこ', reading: 'いとこ', meaning: 'primo/a', example: 'いとこは東京に住んでいます。', exampleMeaning: 'Mi primo vive en Tokio.' },
    { id: 'p040', japanese: '友達', reading: 'ともだち', meaning: 'amigo', example: '友達と映画を見ました。', exampleMeaning: 'Vi una película con mi amigo.' },
    { id: 'p041', japanese: '男', reading: 'おとこ', meaning: 'hombre', example: 'あの男の人は誰ですか。', exampleMeaning: '¿Quién es ese hombre?' },
    { id: 'p042', japanese: '女', reading: 'おんな', meaning: 'mujer', example: 'あの女の人は先生です。', exampleMeaning: 'Esa mujer es profesora.' },
    { id: 'p043', japanese: '男の子', reading: 'おとこのこ', meaning: 'niño', example: '男の子が走っています。', exampleMeaning: 'El niño está corriendo.' },
    { id: 'p044', japanese: '女の子', reading: 'おんなのこ', meaning: 'niña', example: '女の子が歌っています。', exampleMeaning: 'La niña está cantando.' },
    { id: 'p045', japanese: 'だれ', reading: 'だれ', meaning: '¿quién?', example: 'だれが来ましたか。', exampleMeaning: '¿Quién vino?' },
    { id: 'p046', japanese: '彼', reading: 'かれ', meaning: 'él / novio', example: '彼は学生です。', exampleMeaning: 'Él es estudiante.' },
  ],

  // ---------------------------------------------------------------------------
  // 2. COMIDA (食べ物)
  // ---------------------------------------------------------------------------
  food: [
    { id: 'f001', japanese: 'ご飯', reading: 'ごはん', meaning: 'arroz / comida', example: 'ご飯を食べます。', exampleMeaning: 'Como arroz.' },
    { id: 'f002', japanese: 'パン', reading: 'パン', meaning: 'pan', example: '朝パンを食べます。', exampleMeaning: 'Como pan en la mañana.' },
    { id: 'f003', japanese: '肉', reading: 'にく', meaning: 'carne', example: '肉が好きです。', exampleMeaning: 'Me gusta la carne.' },
    { id: 'f004', japanese: '魚', reading: 'さかな', meaning: 'pescado', example: '魚を食べます。', exampleMeaning: 'Como pescado.' },
    { id: 'f005', japanese: '野菜', reading: 'やさい', meaning: 'verduras', example: '野菜を食べてください。', exampleMeaning: 'Come verduras.' },
    { id: 'f006', japanese: '卵', reading: 'たまご', meaning: 'huevo', example: '卵を買いました。', exampleMeaning: 'Compré huevos.' },
    { id: 'f007', japanese: '果物', reading: 'くだもの', meaning: 'fruta', example: '果物が好きです。', exampleMeaning: 'Me gustan las frutas.' },
    { id: 'f008', japanese: 'りんご', reading: 'りんご', meaning: 'manzana', example: 'りんごを食べます。', exampleMeaning: 'Como una manzana.' },
    { id: 'f009', japanese: 'みかん', reading: 'みかん', meaning: 'mandarina', example: 'みかんは甘いです。', exampleMeaning: 'La mandarina es dulce.' },
    { id: 'f010', japanese: 'バナナ', reading: 'バナナ', meaning: 'plátano', example: 'バナナを買いました。', exampleMeaning: 'Compré plátanos.' },
    { id: 'f011', japanese: '水', reading: 'みず', meaning: 'agua', example: '水を飲みます。', exampleMeaning: 'Bebo agua.' },
    { id: 'f012', japanese: 'お茶', reading: 'おちゃ', meaning: 'té', example: 'お茶を飲みましょう。', exampleMeaning: 'Tomemos té.' },
    { id: 'f013', japanese: 'コーヒー', reading: 'コーヒー', meaning: 'café', example: 'コーヒーを飲みます。', exampleMeaning: 'Tomo café.' },
    { id: 'f014', japanese: '牛乳', reading: 'ぎゅうにゅう', meaning: 'leche', example: '牛乳を飲みます。', exampleMeaning: 'Bebo leche.' },
    { id: 'f015', japanese: 'ジュース', reading: 'ジュース', meaning: 'jugo', example: 'オレンジジュースをください。', exampleMeaning: 'Deme jugo de naranja.' },
    { id: 'f016', japanese: 'お酒', reading: 'おさけ', meaning: 'alcohol / sake', example: 'お酒を飲みますか。', exampleMeaning: '¿Bebes alcohol?' },
    { id: 'f017', japanese: 'ビール', reading: 'ビール', meaning: 'cerveza', example: 'ビールを飲みましょう。', exampleMeaning: 'Tomemos cerveza.' },
    { id: 'f018', japanese: '料理', reading: 'りょうり', meaning: 'cocina / platillo', example: '日本料理が好きです。', exampleMeaning: 'Me gusta la comida japonesa.' },
    { id: 'f019', japanese: '朝ご飯', reading: 'あさごはん', meaning: 'desayuno', example: '朝ご飯を食べました。', exampleMeaning: 'Desayuné.' },
    { id: 'f020', japanese: '昼ご飯', reading: 'ひるごはん', meaning: 'almuerzo', example: '昼ご飯を食べましょう。', exampleMeaning: 'Almorcemos.' },
    { id: 'f021', japanese: '晩ご飯', reading: 'ばんごはん', meaning: 'cena', example: '晩ご飯は何ですか。', exampleMeaning: '¿Qué hay de cena?' },
    { id: 'f022', japanese: '弁当', reading: 'べんとう', meaning: 'almuerzo empacado', example: '弁当を持っていきます。', exampleMeaning: 'Llevo mi almuerzo.' },
    { id: 'f023', japanese: 'ラーメン', reading: 'ラーメン', meaning: 'ramen', example: 'ラーメンを食べます。', exampleMeaning: 'Como ramen.' },
    { id: 'f024', japanese: 'うどん', reading: 'うどん', meaning: 'udon (fideos gruesos)', example: 'うどんが好きです。', exampleMeaning: 'Me gusta el udon.' },
    { id: 'f025', japanese: 'そば', reading: 'そば', meaning: 'soba (fideos de trigo)', example: 'そばを食べましょう。', exampleMeaning: 'Comamos soba.' },
    { id: 'f026', japanese: 'カレー', reading: 'カレー', meaning: 'curry', example: 'カレーライスを作ります。', exampleMeaning: 'Preparo arroz con curry.' },
    { id: 'f027', japanese: 'ケーキ', reading: 'ケーキ', meaning: 'pastel', example: 'ケーキを買いました。', exampleMeaning: 'Compré un pastel.' },
    { id: 'f028', japanese: 'アイスクリーム', reading: 'アイスクリーム', meaning: 'helado', example: 'アイスクリームが好きです。', exampleMeaning: 'Me gusta el helado.' },
    { id: 'f029', japanese: 'チョコレート', reading: 'チョコレート', meaning: 'chocolate', example: 'チョコレートをください。', exampleMeaning: 'Deme chocolate.' },
    { id: 'f030', japanese: '塩', reading: 'しお', meaning: 'sal', example: '塩を取ってください。', exampleMeaning: 'Pásame la sal.' },
    { id: 'f031', japanese: '砂糖', reading: 'さとう', meaning: 'azúcar', example: '砂糖を入れますか。', exampleMeaning: '¿Le pongo azúcar?' },
    { id: 'f032', japanese: '醤油', reading: 'しょうゆ', meaning: 'salsa de soya', example: '醤油をかけます。', exampleMeaning: 'Le pongo salsa de soya.' },
    { id: 'f033', japanese: '箸', reading: 'はし', meaning: 'palillos', example: '箸で食べます。', exampleMeaning: 'Como con palillos.' },
    { id: 'f034', japanese: 'スプーン', reading: 'スプーン', meaning: 'cuchara', example: 'スプーンをください。', exampleMeaning: 'Deme una cuchara.' },
    { id: 'f035', japanese: 'フォーク', reading: 'フォーク', meaning: 'tenedor', example: 'フォークで食べます。', exampleMeaning: 'Como con tenedor.' },
    { id: 'f036', japanese: 'ナイフ', reading: 'ナイフ', meaning: 'cuchillo', example: 'ナイフで切ります。', exampleMeaning: 'Corto con cuchillo.' },
    { id: 'f037', japanese: '皿', reading: 'さら', meaning: 'plato', example: '皿を洗います。', exampleMeaning: 'Lavo los platos.' },
    { id: 'f038', japanese: 'コップ', reading: 'コップ', meaning: 'vaso', example: 'コップに水を入れます。', exampleMeaning: 'Pongo agua en el vaso.' },
    { id: 'f039', japanese: 'カップ', reading: 'カップ', meaning: 'taza', example: 'コーヒーカップをください。', exampleMeaning: 'Deme una taza de café.' },
    { id: 'f040', japanese: 'お腹が空く', reading: 'おなかがすく', meaning: 'tener hambre', example: 'お腹が空きました。', exampleMeaning: 'Tengo hambre.' },
    { id: 'f041', japanese: 'のどが渇く', reading: 'のどがかわく', meaning: 'tener sed', example: 'のどが渇きました。', exampleMeaning: 'Tengo sed.' },
  ],

  // ---------------------------------------------------------------------------
  // 3. ROPA (服)
  // ---------------------------------------------------------------------------
  clothes: [
    { id: 'c001', japanese: '服', reading: 'ふく', meaning: 'ropa', example: '新しい服を買いました。', exampleMeaning: 'Compré ropa nueva.' },
    { id: 'c002', japanese: 'シャツ', reading: 'シャツ', meaning: 'camisa', example: '白いシャツを着ています。', exampleMeaning: 'Llevo una camisa blanca.' },
    { id: 'c003', japanese: 'Tシャツ', reading: 'ティーシャツ', meaning: 'camiseta', example: 'Tシャツを買いました。', exampleMeaning: 'Compré una camiseta.' },
    { id: 'c004', japanese: 'ズボン', reading: 'ズボン', meaning: 'pantalón', example: 'ズボンをはいています。', exampleMeaning: 'Llevo pantalones.' },
    { id: 'c005', japanese: 'スカート', reading: 'スカート', meaning: 'falda', example: 'スカートをはきます。', exampleMeaning: 'Me pongo una falda.' },
    { id: 'c006', japanese: 'コート', reading: 'コート', meaning: 'abrigo', example: 'コートを着てください。', exampleMeaning: 'Ponte el abrigo.' },
    { id: 'c007', japanese: 'セーター', reading: 'セーター', meaning: 'suéter', example: 'セーターを着ます。', exampleMeaning: 'Me pongo un suéter.' },
    { id: 'c008', japanese: '帽子', reading: 'ぼうし', meaning: 'sombrero / gorra', example: '帽子をかぶります。', exampleMeaning: 'Me pongo el sombrero.' },
    { id: 'c009', japanese: '靴', reading: 'くつ', meaning: 'zapatos', example: '靴を脱いでください。', exampleMeaning: 'Quítese los zapatos.' },
    { id: 'c010', japanese: '靴下', reading: 'くつした', meaning: 'calcetines', example: '靴下をはきます。', exampleMeaning: 'Me pongo los calcetines.' },
    { id: 'c011', japanese: 'ネクタイ', reading: 'ネクタイ', meaning: 'corbata', example: 'ネクタイをしめます。', exampleMeaning: 'Me pongo la corbata.' },
    { id: 'c012', japanese: 'めがね', reading: 'めがね', meaning: 'lentes', example: 'めがねをかけています。', exampleMeaning: 'Llevo lentes.' },
    { id: 'c013', japanese: '時計', reading: 'とけい', meaning: 'reloj', example: '時計をしています。', exampleMeaning: 'Llevo un reloj.' },
    { id: 'c014', japanese: 'かばん', reading: 'かばん', meaning: 'bolso / maleta', example: 'かばんを持っています。', exampleMeaning: 'Llevo un bolso.' },
    { id: 'c015', japanese: '傘', reading: 'かさ', meaning: 'paraguas', example: '傘を持っていきます。', exampleMeaning: 'Llevo paraguas.' },
    { id: 'c016', japanese: '財布', reading: 'さいふ', meaning: 'cartera', example: '財布を忘れました。', exampleMeaning: 'Olvidé mi cartera.' },
  ],

  // ---------------------------------------------------------------------------
  // 4. CASA (家)
  // ---------------------------------------------------------------------------
  house: [
    { id: 'h001', japanese: '家', reading: 'いえ/うち', meaning: 'casa', example: '家に帰ります。', exampleMeaning: 'Regreso a casa.' },
    { id: 'h002', japanese: 'アパート', reading: 'アパート', meaning: 'apartamento', example: 'アパートに住んでいます。', exampleMeaning: 'Vivo en un apartamento.' },
    { id: 'h003', japanese: '部屋', reading: 'へや', meaning: 'habitación', example: '部屋を掃除します。', exampleMeaning: 'Limpio la habitación.' },
    { id: 'h004', japanese: '台所', reading: 'だいどころ', meaning: 'cocina', example: '台所で料理します。', exampleMeaning: 'Cocino en la cocina.' },
    { id: 'h005', japanese: 'トイレ', reading: 'トイレ', meaning: 'baño', example: 'トイレはどこですか。', exampleMeaning: '¿Dónde está el baño?' },
    { id: 'h006', japanese: 'お風呂', reading: 'おふろ', meaning: 'bañera / baño', example: 'お風呂に入ります。', exampleMeaning: 'Me baño.' },
    { id: 'h007', japanese: '玄関', reading: 'げんかん', meaning: 'entrada', example: '玄関で靴を脱ぎます。', exampleMeaning: 'Me quito los zapatos en la entrada.' },
    { id: 'h008', japanese: '庭', reading: 'にわ', meaning: 'jardín', example: '庭に花があります。', exampleMeaning: 'Hay flores en el jardín.' },
    { id: 'h009', japanese: '階段', reading: 'かいだん', meaning: 'escaleras', example: '階段を上ります。', exampleMeaning: 'Subo las escaleras.' },
    { id: 'h010', japanese: '机', reading: 'つくえ', meaning: 'escritorio', example: '机の上に本があります。', exampleMeaning: 'Hay un libro en el escritorio.' },
    { id: 'h011', japanese: '椅子', reading: 'いす', meaning: 'silla', example: '椅子に座ってください。', exampleMeaning: 'Siéntese en la silla.' },
    { id: 'h012', japanese: 'テーブル', reading: 'テーブル', meaning: 'mesa', example: 'テーブルの上に置きます。', exampleMeaning: 'Lo pongo en la mesa.' },
    { id: 'h013', japanese: 'ベッド', reading: 'ベッド', meaning: 'cama', example: 'ベッドで寝ます。', exampleMeaning: 'Duermo en la cama.' },
    { id: 'h014', japanese: 'ソファ', reading: 'ソファ', meaning: 'sofá', example: 'ソファに座ります。', exampleMeaning: 'Me siento en el sofá.' },
    { id: 'h015', japanese: 'ドア', reading: 'ドア', meaning: 'puerta', example: 'ドアを開けてください。', exampleMeaning: 'Abre la puerta.' },
    { id: 'h016', japanese: '窓', reading: 'まど', meaning: 'ventana', example: '窓を開けてください。', exampleMeaning: 'Abre la ventana, por favor.' },
    { id: 'h017', japanese: '壁', reading: 'かべ', meaning: 'pared', example: '壁に絵があります。', exampleMeaning: 'Hay un cuadro en la pared.' },
  ],

  // ---------------------------------------------------------------------------
  // 5. TRANSPORTE (乗り物)
  // ---------------------------------------------------------------------------
  vehicle: [
    { id: 'v001', japanese: '車', reading: 'くるま', meaning: 'carro / auto', example: '車で行きます。', exampleMeaning: 'Voy en carro.' },
    { id: 'v002', japanese: '自転車', reading: 'じてんしゃ', meaning: 'bicicleta', example: '自転車に乗ります。', exampleMeaning: 'Monto bicicleta.' },
    { id: 'v003', japanese: '飛行機', reading: 'ひこうき', meaning: 'avión', example: '飛行機で日本に行きます。', exampleMeaning: 'Voy a Japón en avión.' },
    { id: 'v004', japanese: '電車', reading: 'でんしゃ', meaning: 'tren', example: '電車で会社に行きます。', exampleMeaning: 'Voy al trabajo en tren.' },
    { id: 'v005', japanese: '地下鉄', reading: 'ちかてつ', meaning: 'metro', example: '地下鉄は便利です。', exampleMeaning: 'El metro es conveniente.' },
    { id: 'v006', japanese: 'バス', reading: 'バス', meaning: 'bus', example: 'バスに乗ります。', exampleMeaning: 'Tomo el bus.' },
    { id: 'v007', japanese: 'バイク', reading: 'バイク', meaning: 'motocicleta', example: 'バイクで行きました。', exampleMeaning: 'Fui en motocicleta.' },
    { id: 'v008', japanese: 'タクシー', reading: 'タクシー', meaning: 'taxi', example: 'タクシーを呼びます。', exampleMeaning: 'Llamo un taxi.' },
    { id: 'v009', japanese: '船', reading: 'ふね', meaning: 'barco', example: '船で島に行きます。', exampleMeaning: 'Voy a la isla en barco.' },
    { id: 'v010', japanese: 'エレベーター', reading: 'エレベーター', meaning: 'ascensor', example: 'エレベーターで五階に行きます。', exampleMeaning: 'Voy al quinto piso en ascensor.' },
    { id: 'v011', japanese: 'エスカレーター', reading: 'エスカレーター', meaning: 'escalera mecánica', example: 'エスカレーターで上に行きます。', exampleMeaning: 'Subo por la escalera mecánica.' },
  ],

  // ---------------------------------------------------------------------------
  // 6. HERRAMIENTAS (道具)
  // ---------------------------------------------------------------------------
  tools: [
    { id: 't001', japanese: 'ペン', reading: 'ペン', meaning: 'bolígrafo', example: 'ペンを貸してください。', exampleMeaning: 'Préstame un bolígrafo.' },
    { id: 't002', japanese: 'えんぴつ', reading: 'えんぴつ', meaning: 'lápiz', example: 'えんぴつで書いてください。', exampleMeaning: 'Escribe con lápiz.' },
    { id: 't003', japanese: '消しゴム', reading: 'けしゴム', meaning: 'borrador', example: '消しゴムを使います。', exampleMeaning: 'Uso el borrador.' },
    { id: 't004', japanese: '紙', reading: 'かみ', meaning: 'papel', example: '紙に名前を書きます。', exampleMeaning: 'Escribo mi nombre en el papel.' },
    { id: 't005', japanese: '切手', reading: 'きって', meaning: 'estampilla', example: '切手を買います。', exampleMeaning: 'Compro estampillas.' },
    { id: 't006', japanese: '本', reading: 'ほん', meaning: 'libro', example: '本を読んでいます。', exampleMeaning: 'Estoy leyendo un libro.' },
    { id: 't007', japanese: '雑誌', reading: 'ざっし', meaning: 'revista', example: '雑誌を買いました。', exampleMeaning: 'Compré una revista.' },
    { id: 't008', japanese: '新聞', reading: 'しんぶん', meaning: 'periódico', example: '毎朝新聞を読みます。', exampleMeaning: 'Leo el periódico todas las mañanas.' },
    { id: 't009', japanese: '辞書', reading: 'じしょ', meaning: 'diccionario', example: '辞書で調べます。', exampleMeaning: 'Lo busco en el diccionario.' },
    { id: 't010', japanese: '地図', reading: 'ちず', meaning: 'mapa', example: '地図を見てください。', exampleMeaning: 'Mira el mapa.' },
    { id: 't011', japanese: 'カレンダー', reading: 'カレンダー', meaning: 'calendario', example: 'カレンダーを見ます。', exampleMeaning: 'Miro el calendario.' },
    { id: 't012', japanese: '時計', reading: 'とけい', meaning: 'reloj', example: '時計を見てください。', exampleMeaning: 'Mira el reloj.' },
    { id: 't013', japanese: 'テレビ', reading: 'テレビ', meaning: 'televisión', example: 'テレビを見ます。', exampleMeaning: 'Veo televisión.' },
    { id: 't014', japanese: 'ラジオ', reading: 'ラジオ', meaning: 'radio', example: 'ラジオを聞きます。', exampleMeaning: 'Escucho la radio.' },
    { id: 't015', japanese: 'カメラ', reading: 'カメラ', meaning: 'cámara', example: 'カメラで写真を撮ります。', exampleMeaning: 'Tomo fotos con la cámara.' },
    { id: 't016', japanese: '電気', reading: 'でんき', meaning: 'electricidad / luz', example: '電気をつけてください。', exampleMeaning: 'Enciende la luz.' },
    { id: 't017', japanese: '冷蔵庫', reading: 'れいぞうこ', meaning: 'refrigerador', example: '冷蔵庫に入れます。', exampleMeaning: 'Lo pongo en el refrigerador.' },
    { id: 't018', japanese: 'エアコン', reading: 'エアコン', meaning: 'aire acondicionado', example: 'エアコンをつけます。', exampleMeaning: 'Enciendo el aire acondicionado.' },
    { id: 't019', japanese: '花瓶', reading: 'かびん', meaning: 'florero', example: '花瓶に花を入れます。', exampleMeaning: 'Pongo flores en el florero.' },
    { id: 't020', japanese: 'ピアノ', reading: 'ピアノ', meaning: 'piano', example: 'ピアノを弾きます。', exampleMeaning: 'Toco el piano.' },
    { id: 't021', japanese: 'ギター', reading: 'ギター', meaning: 'guitarra', example: 'ギターを習っています。', exampleMeaning: 'Estoy aprendiendo guitarra.' },
    { id: 't022', japanese: '携帯電話', reading: 'けいたいでんわ', meaning: 'teléfono móvil', example: '携帯電話を忘れました。', exampleMeaning: 'Olvidé mi teléfono móvil.' },
    { id: 't023', japanese: 'パソコン', reading: 'パソコン', meaning: 'computadora', example: 'パソコンで仕事をします。', exampleMeaning: 'Trabajo con la computadora.' },
  ],

  // Placeholder para las demás categorías (se completarán en los archivos part2, part3, part4)
  date: [],
  time: [],
  location: [],
  facility: [],
  body: [],
  nature: [],
  condition: [],
  work: [],
  adjectives: [],
  verbs: [],
  numbers: [],
};

// Función para obtener todas las palabras
export const getAllWords = (): VocabWord[] => {
  return Object.values(VOCAB_DATA).flat();
};

// Función para buscar palabras
export const searchWords = (query: string): VocabWord[] => {
  const q = query.toLowerCase();
  return getAllWords().filter(
    word =>
      word.japanese.includes(query) ||
      word.reading?.includes(query) ||
      word.meaning.toLowerCase().includes(q)
  );
};

// Función para obtener palabra por ID
export const getWordById = (id: string): VocabWord | undefined => {
  return getAllWords().find(word => word.id === id);
};

// Estadísticas
export const getVocabStats = () => {
  const allWords = getAllWords();
  const categories = Object.keys(VOCAB_DATA).filter(key => VOCAB_DATA[key].length > 0);
  
  return {
    totalWords: allWords.length,
    totalCategories: categories.length,
    wordsByCategory: categories.map(cat => ({
      category: cat,
      count: VOCAB_DATA[cat].length,
    })),
  };
};