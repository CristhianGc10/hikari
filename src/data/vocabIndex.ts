// src/data/vocabIndex.ts
// Archivo índice que combina todos los datos de vocabulario

import { VOCAB_DATA, VOCAB_CATEGORIES, VocabWord, VocabCategory } from './vocabData';
import { DATE_VOCAB, TIME_VOCAB, LOCATION_VOCAB, FACILITY_VOCAB, BODY_VOCAB, NATURE_VOCAB } from './vocabDataPart2';
import { CONDITION_VOCAB, WORK_VOCAB, ADJECTIVE_VOCAB } from './vocabDataPart3';
import { VERB_VOCAB } from './vocabDataPart4';

// Re-exportar tipos
export type { VocabWord, VocabCategory };

// Combinar todos los datos de vocabulario
export const COMPLETE_VOCAB_DATA: Record<string, VocabWord[]> = {
  ...VOCAB_DATA,
  date: DATE_VOCAB,
  time: TIME_VOCAB,
  location: LOCATION_VOCAB,
  facility: FACILITY_VOCAB,
  body: BODY_VOCAB,
  nature: NATURE_VOCAB,
  condition: CONDITION_VOCAB,
  work: WORK_VOCAB,
  adjectives: ADJECTIVE_VOCAB,
  verbs: VERB_VOCAB,
};

// Actualizar categorías con conteos correctos
export const COMPLETE_VOCAB_CATEGORIES: VocabCategory[] = VOCAB_CATEGORIES.map(cat => ({
  ...cat,
  wordCount: COMPLETE_VOCAB_DATA[cat.id]?.length || 0,
}));

// =============================================================================
// FUNCIONES DE UTILIDAD
// =============================================================================

/**
 * Obtiene todas las palabras de todas las categorías
 */
export const getAllCompleteWords = (): VocabWord[] => {
  return Object.values(COMPLETE_VOCAB_DATA).flat();
};

/**
 * Busca palabras en todas las categorías
 */
export const searchAllWords = (query: string): VocabWord[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return getAllCompleteWords().filter(
    word =>
      word.japanese.includes(query) ||
      word.reading?.includes(query) ||
      word.meaning.toLowerCase().includes(q) ||
      word.example?.includes(query) ||
      word.tags?.some(tag => tag.toLowerCase().includes(q))
  );
};

/**
 * Obtiene una palabra por su ID
 */
export const getWordById = (id: string): VocabWord | undefined => {
  return getAllCompleteWords().find(word => word.id === id);
};

/**
 * Obtiene una categoría por su ID
 */
export const getCategoryById = (id: string): VocabCategory | undefined => {
  return COMPLETE_VOCAB_CATEGORIES.find(cat => cat.id === id);
};

/**
 * Obtiene las palabras de una categoría específica
 */
export const getWordsByCategory = (categoryId: string): VocabWord[] => {
  return COMPLETE_VOCAB_DATA[categoryId] || [];
};

/**
 * Obtiene estadísticas completas del vocabulario
 */
export const getCompleteVocabStats = () => {
  const allWords = getAllCompleteWords();
  const categoriesWithWords = Object.entries(COMPLETE_VOCAB_DATA)
    .filter(([_, words]) => words.length > 0);
  
  return {
    totalWords: allWords.length,
    totalCategories: categoriesWithWords.length,
    wordsByCategory: categoriesWithWords.map(([categoryId, words]) => {
      const category = getCategoryById(categoryId);
      return {
        id: categoryId,
        titleJp: category?.titleJp || categoryId,
        titleEs: category?.titleEs || categoryId,
        count: words.length,
      };
    }),
  };
};

/**
 * Obtiene palabras aleatorias
 */
export const getRandomWords = (count: number, categoryId?: string): VocabWord[] => {
  const sourceWords = categoryId 
    ? getWordsByCategory(categoryId) 
    : getAllCompleteWords();
  
  const shuffled = [...sourceWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Obtiene palabras por dificultad (basado en longitud y kanji)
 */
export const getWordsByDifficulty = (level: 'easy' | 'medium' | 'hard'): VocabWord[] => {
  const allWords = getAllCompleteWords();
  
  return allWords.filter(word => {
    const hasKanji = /[\u4e00-\u9faf]/.test(word.japanese);
    const kanjiCount = (word.japanese.match(/[\u4e00-\u9faf]/g) || []).length;
    
    switch (level) {
      case 'easy':
        // Palabras sin kanji (solo hiragana/katakana)
        return !hasKanji;
      case 'medium':
        // Palabras con 1-2 kanji
        return kanjiCount >= 1 && kanjiCount <= 2;
      case 'hard':
        // Palabras con 3+ kanji
        return kanjiCount >= 3;
      default:
        return true;
    }
  });
};

/**
 * Obtiene palabras que contienen un kanji específico
 */
export const getWordsByKanji = (kanji: string): VocabWord[] => {
  return getAllCompleteWords().filter(word => word.japanese.includes(kanji));
};

/**
 * Obtiene verbos por grupo
 */
export const getVerbsByGroup = (group: 1 | 2 | 3): VocabWord[] => {
  return VERB_VOCAB.filter(verb => {
    const tags = verb.tags || [];
    switch (group) {
      case 1:
        return tags.includes('Grupo 1');
      case 2:
        return tags.includes('Grupo 2');
      case 3:
        return tags.includes('Grupo 3');
      default:
        return false;
    }
  });
};

/**
 * Obtiene adjetivos por tipo
 */
export const getAdjectivesByType = (type: 'i' | 'na'): VocabWord[] => {
  return ADJECTIVE_VOCAB.filter(adj => {
    if (type === 'i') {
      // い-adjetivos terminan en い (excepto きれい y 嫌い que son な-adjetivos)
      const exceptions = ['きれい', '嫌い'];
      return adj.japanese.endsWith('い') && !exceptions.includes(adj.japanese);
    } else {
      // な-adjetivos
      const naAdjectives = ['好き', '嫌い', '上手', '下手', '元気', '静か', 'にぎやか', 
                           '有名', '親切', '大切', '大丈夫', '便利', '不便', 'きれい', 
                           '簡単', '暇'];
      return naAdjectives.includes(adj.japanese);
    }
  });
};

// =============================================================================
// EXPORT POR DEFECTO
// =============================================================================

export default {
  data: COMPLETE_VOCAB_DATA,
  categories: COMPLETE_VOCAB_CATEGORIES,
  getAllWords: getAllCompleteWords,
  searchWords: searchAllWords,
  getWordById,
  getCategoryById,
  getWordsByCategory,
  getStats: getCompleteVocabStats,
  getRandomWords,
  getWordsByDifficulty,
  getWordsByKanji,
  getVerbsByGroup,
  getAdjectivesByType,
};