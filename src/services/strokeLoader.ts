// src/services/strokeLoader.ts
//
// Servicio de carga de trazos para kana y kanji
// Usa SVGs almacenados como texto raw para máxima eficiencia
// Soporta caracteres combinados (yōon) como きゃ, しゅ, etc.
//

import KVG_INDEX from '../../assets/kvg-index.json';

// Tipo para el índice
type KvgIndex = Record<string, string[]>;

// Cache en memoria
const strokeCache = new Map<string, string[]>();

// ============================================
// MAPEO DE CARACTERES COMBINADOS (YŌON)
// ============================================

// Hiragana combinados
const HIRAGANA_YOON: Record<string, [string, string]> = {
  // K + ya/yu/yo
  'きゃ': ['き', 'ゃ'], 'きゅ': ['き', 'ゅ'], 'きょ': ['き', 'ょ'],
  'ぎゃ': ['ぎ', 'ゃ'], 'ぎゅ': ['ぎ', 'ゅ'], 'ぎょ': ['ぎ', 'ょ'],
  // S + ya/yu/yo
  'しゃ': ['し', 'ゃ'], 'しゅ': ['し', 'ゅ'], 'しょ': ['し', 'ょ'],
  'じゃ': ['じ', 'ゃ'], 'じゅ': ['じ', 'ゅ'], 'じょ': ['じ', 'ょ'],
  // T + ya/yu/yo
  'ちゃ': ['ち', 'ゃ'], 'ちゅ': ['ち', 'ゅ'], 'ちょ': ['ち', 'ょ'],
  'ぢゃ': ['ぢ', 'ゃ'], 'ぢゅ': ['ぢ', 'ゅ'], 'ぢょ': ['ぢ', 'ょ'],
  // N + ya/yu/yo
  'にゃ': ['に', 'ゃ'], 'にゅ': ['に', 'ゅ'], 'にょ': ['に', 'ょ'],
  // H + ya/yu/yo
  'ひゃ': ['ひ', 'ゃ'], 'ひゅ': ['ひ', 'ゅ'], 'ひょ': ['ひ', 'ょ'],
  'びゃ': ['び', 'ゃ'], 'びゅ': ['び', 'ゅ'], 'びょ': ['び', 'ょ'],
  'ぴゃ': ['ぴ', 'ゃ'], 'ぴゅ': ['ぴ', 'ゅ'], 'ぴょ': ['ぴ', 'ょ'],
  // M + ya/yu/yo
  'みゃ': ['み', 'ゃ'], 'みゅ': ['み', 'ゅ'], 'みょ': ['み', 'ょ'],
  // R + ya/yu/yo
  'りゃ': ['り', 'ゃ'], 'りゅ': ['り', 'ゅ'], 'りょ': ['り', 'ょ'],
};

// Katakana combinados
const KATAKANA_YOON: Record<string, [string, string]> = {
  // K + ya/yu/yo
  'キャ': ['キ', 'ャ'], 'キュ': ['キ', 'ュ'], 'キョ': ['キ', 'ョ'],
  'ギャ': ['ギ', 'ャ'], 'ギュ': ['ギ', 'ュ'], 'ギョ': ['ギ', 'ョ'],
  // S + ya/yu/yo
  'シャ': ['シ', 'ャ'], 'シュ': ['シ', 'ュ'], 'ショ': ['シ', 'ョ'],
  'ジャ': ['ジ', 'ャ'], 'ジュ': ['ジ', 'ュ'], 'ジョ': ['ジ', 'ョ'],
  // T + ya/yu/yo
  'チャ': ['チ', 'ャ'], 'チュ': ['チ', 'ュ'], 'チョ': ['チ', 'ョ'],
  'ヂャ': ['ヂ', 'ャ'], 'ヂュ': ['ヂ', 'ュ'], 'ヂョ': ['ヂ', 'ョ'],
  // N + ya/yu/yo
  'ニャ': ['ニ', 'ャ'], 'ニュ': ['ニ', 'ュ'], 'ニョ': ['ニ', 'ョ'],
  // H + ya/yu/yo
  'ヒャ': ['ヒ', 'ャ'], 'ヒュ': ['ヒ', 'ュ'], 'ヒョ': ['ヒ', 'ョ'],
  'ビャ': ['ビ', 'ャ'], 'ビュ': ['ビ', 'ュ'], 'ビョ': ['ビ', 'ョ'],
  'ピャ': ['ピ', 'ャ'], 'ピュ': ['ピ', 'ュ'], 'ピョ': ['ピ', 'ョ'],
  // M + ya/yu/yo
  'ミャ': ['ミ', 'ャ'], 'ミュ': ['ミ', 'ュ'], 'ミョ': ['ミ', 'ョ'],
  // R + ya/yu/yo
  'リャ': ['リ', 'ャ'], 'リュ': ['リ', 'ュ'], 'リョ': ['リ', 'ョ'],
};

// Combinar ambos mapeos
const COMBINED_CHARS: Record<string, [string, string]> = {
  ...HIRAGANA_YOON,
  ...KATAKANA_YOON,
};

/**
 * Verifica si un carácter es combinado (yōon)
 */
export const isCombinedCharacter = (character: string): boolean => {
  return character in COMBINED_CHARS;
};

/**
 * Obtiene los componentes de un carácter combinado
 */
export const getCombinedComponents = (character: string): [string, string] | null => {
  return COMBINED_CHARS[character] || null;
};

/**
 * Extrae los paths de trazos de un contenido SVG
 * Busca específicamente los paths con id de trazo (kvg:XXXXX-sN)
 */
export const extractStrokePaths = (svgContent: string): string[] => {
  const paths: string[] = [];
  
  // Patrón para paths con ID de trazo de KanjiVG
  const strokeRegex = /<path[^>]*id="kvg:[^"]*-s(\d+)"[^>]*d="([^"]+)"[^>]*\/?>/g;
  const matches: Array<{ order: number; path: string }> = [];
  
  let match;
  while ((match = strokeRegex.exec(svgContent)) !== null) {
    matches.push({
      order: parseInt(match[1], 10),
      path: match[2]
    });
  }
  
  // Ordenar por número de trazo y extraer paths
  if (matches.length > 0) {
    matches.sort((a, b) => a.order - b.order);
    return matches.map(m => m.path);
  }
  
  // Fallback: buscar cualquier path con atributo d
  const fallbackRegex = /<path[^>]*\sd="([^"]+)"[^>]*\/?>/g;
  while ((match = fallbackRegex.exec(svgContent)) !== null) {
    // Ignorar paths que parecen ser solo para números o guías
    if (!match[0].includes('StrokeNumbers')) {
      paths.push(match[1]);
    }
  }
  
  return paths;
};

/**
 * Parsea un path SVG y retorna los tokens (comandos y números)
 */
const parsePathTokens = (pathD: string): Array<{ type: 'command' | 'number'; value: string }> => {
  const tokens: Array<{ type: 'command' | 'number'; value: string }> = [];
  
  // Regex que captura comandos SVG y números (incluyendo negativos y decimales)
  const regex = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:[eE][+-]?\d+)?)/g;
  
  let match;
  while ((match = regex.exec(pathD)) !== null) {
    if (match[1]) {
      tokens.push({ type: 'command', value: match[1] });
    } else if (match[2]) {
      tokens.push({ type: 'number', value: match[2] });
    }
  }
  
  return tokens;
};

/**
 * Determina cuántos parámetros tiene cada comando SVG y cuáles son X/Y
 * Retorna un array de 'x', 'y', o 'other' para cada parámetro
 */
const getCommandParamTypes = (command: string): Array<'x' | 'y' | 'other'> => {
  const cmd = command.toUpperCase();
  
  switch (cmd) {
    case 'M': // moveto: x, y
    case 'L': // lineto: x, y
    case 'T': // smooth quadratic: x, y
      return ['x', 'y'];
    
    case 'H': // horizontal lineto: x
      return ['x'];
    
    case 'V': // vertical lineto: y
      return ['y'];
    
    case 'C': // cubic bezier: x1, y1, x2, y2, x, y
      return ['x', 'y', 'x', 'y', 'x', 'y'];
    
    case 'S': // smooth cubic: x2, y2, x, y
    case 'Q': // quadratic bezier: x1, y1, x, y
      return ['x', 'y', 'x', 'y'];
    
    case 'A': // arc: rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
      return ['x', 'y', 'other', 'other', 'other', 'x', 'y'];
    
    case 'Z': // closepath: no params
      return [];
    
    default:
      return [];
  }
};

/**
 * Transforma un path SVG aplicando escala y traslación
 * @param pathD - El string del path SVG (atributo d)
 * @param scale - Factor de escala (0-1)
 * @param offsetX - Desplazamiento horizontal
 * @param offsetY - Desplazamiento vertical
 */
export const transformPath = (
  pathD: string,
  scale: number,
  offsetX: number,
  offsetY: number
): string => {
  const tokens = parsePathTokens(pathD);
  const result: string[] = [];
  
  let currentCommand = 'M';
  let isRelative = false;
  let paramIndex = 0;
  let paramTypes: Array<'x' | 'y' | 'other'> = [];
  
  for (const token of tokens) {
    if (token.type === 'command') {
      currentCommand = token.value;
      isRelative = token.value === token.value.toLowerCase();
      paramTypes = getCommandParamTypes(currentCommand);
      paramIndex = 0;
      result.push(token.value);
    } else {
      // Es un número
      const value = parseFloat(token.value);
      
      // Si ya consumimos todos los parámetros del comando, reiniciar
      // (esto maneja secuencias implícitas como "M 0 0 10 10 20 20")
      if (paramIndex >= paramTypes.length && paramTypes.length > 0) {
        paramIndex = 0;
        // Para M, los parámetros implícitos se tratan como L
        if (currentCommand.toUpperCase() === 'M') {
          paramTypes = getCommandParamTypes('L');
        }
      }
      
      const paramType = paramTypes[paramIndex] || 'other';
      let transformedValue: number;
      
      if (isRelative) {
        // Comandos relativos: solo escalar, no trasladar
        transformedValue = value * scale;
      } else {
        // Comandos absolutos: escalar y trasladar
        if (paramType === 'x') {
          transformedValue = value * scale + offsetX;
        } else if (paramType === 'y') {
          transformedValue = value * scale + offsetY;
        } else {
          // Para otros parámetros (ángulos, flags en arcos), solo escalar si es tamaño
          // Los rx, ry en arcos sí se escalan
          if (currentCommand.toUpperCase() === 'A' && paramIndex < 2) {
            transformedValue = value * scale;
          } else {
            transformedValue = value; // Mantener sin cambios (flags, ángulos)
          }
        }
      }
      
      // Redondear a 2 decimales
      result.push(transformedValue.toFixed(2));
      paramIndex++;
    }
  }
  
  return result.join(' ');
};

/**
 * Obtiene el nombre del archivo SVG para un carácter desde el índice
 */
export const getFilenameForCharacter = (character: string): string | null => {
  const index = KVG_INDEX as KvgIndex;
  const files = index[character];
  return files && files.length > 0 ? files[0] : null;
};

/**
 * Obtiene el código Unicode hexadecimal de un carácter
 * Útil para construir nombres de archivo manualmente
 */
export const getUnicodeHex = (character: string): string => {
  return character.charCodeAt(0).toString(16).padStart(5, '0');
};

/**
 * Carga los trazos de un solo carácter (sin combinaciones)
 */
const loadSingleCharacterStrokes = (
  character: string,
  svgRegistry: Record<string, string>
): string[] => {
  const filename = getFilenameForCharacter(character);
  if (!filename) {
    console.warn(`[StrokeLoader] No index entry for: ${character}`);
    return [];
  }
  
  const svgContent = svgRegistry[filename];
  if (!svgContent) {
    console.warn(`[StrokeLoader] SVG not in registry: ${filename}`);
    return [];
  }
  
  return extractStrokePaths(svgContent);
};

/**
 * Carga los trazos de un carácter combinado (yōon)
 * Combina el carácter principal (izquierda, grande) con el pequeño (derecha, pequeño)
 * Retorna un objeto con los paths y metadata adicional
 */
const loadCombinedCharacterStrokes = (
  character: string,
  svgRegistry: Record<string, string>
): string[] => {
  const components = getCombinedComponents(character);
  if (!components) return [];
  
  const [mainChar, smallChar] = components;
  
  // Cargar trazos de ambos caracteres
  const mainStrokes = loadSingleCharacterStrokes(mainChar, svgRegistry);
  const smallStrokes = loadSingleCharacterStrokes(smallChar, svgRegistry);
  
  if (mainStrokes.length === 0 || smallStrokes.length === 0) {
    console.warn(`[StrokeLoader] Could not load components for: ${character}`);
    return [];
  }
  
  // Configuración de posicionamiento para el viewBox de 109x109
  // Ajustado para que ambos caracteres estén alineados horizontalmente
  
  // El carácter principal: reducido y a la izquierda
  const MAIN_SCALE = 0.65;       // 55% del tamaño original
  const MAIN_OFFSET_X = -7;       // Pequeño margen izquierdo
  const MAIN_OFFSET_Y = 20;      // Ajustado para centrar verticalmente
  
  // El carácter pequeño: más pequeño, a la derecha y alineado
  const SMALL_SCALE = 0.6;      // 40% del tamaño original
  const SMALL_OFFSET_X = 50;     // A la derecha
  const SMALL_OFFSET_Y = 20;     // Alineado con el principal (un poco más abajo por ser pequeño)
  
  // Transformar los paths del carácter principal
  const transformedMainStrokes = mainStrokes.map(path =>
    transformPath(path, MAIN_SCALE, MAIN_OFFSET_X, MAIN_OFFSET_Y)
  );
  
  // Transformar los paths del carácter pequeño
  const transformedSmallStrokes = smallStrokes.map(path =>
    transformPath(path, SMALL_SCALE, SMALL_OFFSET_X, SMALL_OFFSET_Y)
  );
  
  // Combinar: primero los del principal, luego los del pequeño
  return [...transformedMainStrokes, ...transformedSmallStrokes];
};

/**
 * Obtiene el grosor de trazo recomendado para un carácter
 * Los caracteres combinados usan trazos más delgados
 */
export const getStrokeWidth = (character: string, defaultWidth: number = 6): number => {
  if (isCombinedCharacter(character)) {
    return defaultWidth * 0.7; // 70% del grosor normal para combinados
  }
  return defaultWidth;
};

/**
 * Carga los trazos con metadata adicional (incluyendo grosor recomendado)
 */
export const loadStrokesWithMetadata = (
  character: string,
  svgRegistry: Record<string, string>
): { strokes: string[]; strokeWidth: number; isCombined: boolean } => {
  const strokes = loadStrokesSync(character, svgRegistry);
  const isCombined = isCombinedCharacter(character);
  
  return {
    strokes,
    strokeWidth: getStrokeWidth(character),
    isCombined,
  };
};

/**
 * Carga los trazos de un carácter
 * Requiere que el SVG esté registrado en SVG_REGISTRY
 * Soporta caracteres combinados (yōon)
 */
export const loadStrokes = async (
  character: string,
  svgRegistry: Record<string, string>
): Promise<string[]> => {
  return loadStrokesSync(character, svgRegistry);
};

/**
 * Carga los trazos de forma síncrona (si ya está en cache o registro)
 * Soporta caracteres combinados (yōon)
 */
export const loadStrokesSync = (
  character: string,
  svgRegistry: Record<string, string>
): string[] => {
  // Verificar cache
  if (strokeCache.has(character)) {
    return strokeCache.get(character)!;
  }
  
  let paths: string[];
  
  // Verificar si es un carácter combinado
  if (isCombinedCharacter(character)) {
    paths = loadCombinedCharacterStrokes(character, svgRegistry);
  } else {
    paths = loadSingleCharacterStrokes(character, svgRegistry);
  }
  
  // Guardar en cache
  if (paths.length > 0) {
    strokeCache.set(character, paths);
  }
  
  return paths;
};

/**
 * Pre-carga múltiples caracteres en el cache
 */
export const preloadCharacters = (
  characters: string[],
  svgRegistry: Record<string, string>
): void => {
  characters.forEach(char => loadStrokesSync(char, svgRegistry));
};

/**
 * Limpia el cache
 */
export const clearStrokeCache = (): void => {
  strokeCache.clear();
};

/**
 * Estadísticas del cache
 */
export const getCacheInfo = () => ({
  cachedCharacters: strokeCache.size,
  characters: Array.from(strokeCache.keys()),
});

/**
 * Verifica si hay datos de trazos disponibles para un carácter
 */
export const hasStrokeData = (
  character: string,
  svgRegistry: Record<string, string>
): boolean => {
  if (strokeCache.has(character)) return true;
  
  // Para caracteres combinados, verificar ambos componentes
  if (isCombinedCharacter(character)) {
    const components = getCombinedComponents(character);
    if (!components) return false;
    
    const [mainChar, smallChar] = components;
    const mainFile = getFilenameForCharacter(mainChar);
    const smallFile = getFilenameForCharacter(smallChar);
    
    return mainFile !== null && 
           smallFile !== null && 
           svgRegistry[mainFile] !== undefined &&
           svgRegistry[smallFile] !== undefined;
  }
  
  const filename = getFilenameForCharacter(character);
  return filename !== null && svgRegistry[filename] !== undefined;
};

/**
 * Obtiene la cantidad de trazos de un carácter
 */
export const getStrokeCount = (
  character: string,
  svgRegistry: Record<string, string>
): number => {
  const strokes = loadStrokesSync(character, svgRegistry);
  return strokes.length;
};

/**
 * Obtiene información sobre un carácter
 */
export const getCharacterInfo = (character: string) => {
  const isCombined = isCombinedCharacter(character);
  const components = isCombined ? getCombinedComponents(character) : null;
  
  return {
    character,
    isCombined,
    components,
    unicode: character.split('').map(c => getUnicodeHex(c)),
  };
};

// Re-exportar el índice
export { KVG_INDEX };