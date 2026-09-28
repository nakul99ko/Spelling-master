import { DifficultyLevel, WordCategory, WordItem } from '../types';
import wordsDataRaw from './wordsData.json';

export const WORDS: WordItem[] = wordsDataRaw as WordItem[];

export const CATEGORIES: WordCategory[] = [
  'Daily Life & Home',
  'Food & Kitchen',
  'Work & Office',
  'Education & Learning',
  'Travel & Places',
  'Health & Human Body',
  'Emotions & Personality',
  'Nature & Weather',
  'Shopping & Finance',
  'Communication & Media',
  'Actions & Verbs',
  'Common Descriptions'
];

export const DIFFICULTIES: DifficultyLevel[] = [
  'Beginner',
  'Elementary',
  'Intermediate',
  'Advanced'
];

export interface WordFilterOptions {
  difficulty?: DifficultyLevel | 'All';
  category?: WordCategory | 'All';
  searchQuery?: string;
  bookmarkedOnly?: boolean;
  bookmarkedIds?: number[];
  mistakesOnly?: boolean;
  mistakeIds?: number[];
}

export function filterWords(options: WordFilterOptions): WordItem[] {
  let list = WORDS;

  if (options.difficulty && options.difficulty !== 'All') {
    list = list.filter(w => w.difficulty === options.difficulty);
  }

  if (options.category && options.category !== 'All') {
    list = list.filter(w => w.category === options.category);
  }

  if (options.bookmarkedOnly && options.bookmarkedIds) {
    const set = new Set(options.bookmarkedIds);
    list = list.filter(w => set.has(w.id));
  }

  if (options.mistakesOnly && options.mistakeIds) {
    const set = new Set(options.mistakeIds);
    list = list.filter(w => set.has(w.id));
  }

  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const q = options.searchQuery.trim().toLowerCase();
    list = list.filter(
      w =>
        w.word.toLowerCase().includes(q) ||
        w.hindiMeaning.toLowerCase().includes(q) ||
        w.partOfSpeech.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getWordById(id: number): WordItem | undefined {
  return WORDS.find(w => w.id === id);
}

export function getRandomWord(options: WordFilterOptions = {}): WordItem {
  const filtered = filterWords(options);
  if (filtered.length === 0) {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getNextWord(currentId: number, options: WordFilterOptions = {}): WordItem {
  const filtered = filterWords(options);
  if (filtered.length === 0) {
    return WORDS[0];
  }
  const currentIndex = filtered.findIndex(w => w.id === currentId);
  if (currentIndex === -1 || currentIndex === filtered.length - 1) {
    return filtered[0];
  }
  return filtered[currentIndex + 1];
}

export function getPreviousWord(currentId: number, options: WordFilterOptions = {}): WordItem {
  const filtered = filterWords(options);
  if (filtered.length === 0) {
    return WORDS[0];
  }
  const currentIndex = filtered.findIndex(w => w.id === currentId);
  if (currentIndex <= 0) {
    return filtered[filtered.length - 1];
  }
  return filtered[currentIndex - 1];
}

export function getVocabularyStats() {
  const total = WORDS.length;
  const byDifficulty: Record<DifficultyLevel, number> = {
    Beginner: 0,
    Elementary: 0,
    Intermediate: 0,
    Advanced: 0
  };
  const byCategory: Record<string, number> = {};

  CATEGORIES.forEach(c => {
    byCategory[c] = 0;
  });

  WORDS.forEach(w => {
    if (byDifficulty[w.difficulty] !== undefined) {
      byDifficulty[w.difficulty]++;
    }
    if (byCategory[w.category] !== undefined) {
      byCategory[w.category]++;
    }
  });

  return { total, byDifficulty, byCategory };
}
