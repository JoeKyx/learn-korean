'use client';
import { createContext, useContext, useReducer } from 'react';

import { PracticeWord, PracticeWords } from '@/lib/db/schema/lessons';
import { UserWord } from '@/lib/db/schema/userWords';
import { WordCategorie, WordCategorieId } from '@/lib/db/schema/wordCategories';
import { WordUserCategorie } from '@/lib/db/schema/wordUserCategories';
import { shuffleArray } from '@/lib/helper';
import { calculateWordLevel } from '@/lib/lessonHelper';
import logger from '@/lib/logger';

export type ModeType = 'english' | 'foreign';

type WordPracticeContextState = {
  allWords: PracticeWords;
  currentWord: PracticeWord | null;
  mode: ModeType;
  wordCategories: WordCategorie[];
  filteredWords: PracticeWords;
  filters: {
    levels: number[];
    categories: WordCategorie[];
  };
  noWords: boolean;
  status: string | null;
};

const initialState: WordPracticeContextState = {
  allWords: [],
  filteredWords: [],
  currentWord: null,
  mode: 'english',
  wordCategories: [],
  filters: {
    levels: [],
    categories: [],
  },
  noWords: false,
  status: null,
};

type WordPracticeAction =
  | { type: 'SET_ALL_WORDS'; payload: PracticeWords }
  | { type: 'SWIPE_WORD'; payload: { success: boolean; userId: string } }
  | {
      type: 'SET_FILTERS';
      payload: { levels?: number[]; categories?: WordCategorie[] };
    }
  | { type: 'SHUFFLE_WORDS' }
  | {
      type: 'ADD_CATEGORY_TO_WORD';
      payload: { wordId: number; categoryId: WordCategorieId; userId: string };
    }
  | {
      type: 'REMOVE_CATEGORY_FROM_WORD';
      payload: { wordId: number; categoryId: number };
    }
  | { type: 'SET_MODE'; payload: { mode: ModeType } };

const applyFilters = (
  words: PracticeWords,
  filters: { levels: number[]; categories: WordCategorie[] }
): PracticeWords => {
  return words.filter((word) => {
    const wordLevel = calculateWordLevel(word);
    const isLevelMatch =
      filters.levels.length === 0 || filters.levels.includes(wordLevel);
    const isCategoryMatch =
      filters.categories.length === 0 ||
      word.categories.some((wordCat) =>
        filters.categories.some(
          (category) => category.id === wordCat.wordcategorieId
        )
      );
    return isLevelMatch && isCategoryMatch;
  });
};

const calculateMode = (word: PracticeWord) => {
  const wl = calculateWordLevel(word);
  if (wl >= 3) return 'foreign';
  else return 'english';
};

const wordPracticeReducer = (
  state: WordPracticeContextState,
  action: WordPracticeAction
): WordPracticeContextState => {
  switch (action.type) {
    case 'SET_ALL_WORDS':
      return { ...state, allWords: action.payload };
    case 'SWIPE_WORD': {
      // get the current word
      const currentWord = state.currentWord;
      if (currentWord) {
        const currentLevel = calculateWordLevel(currentWord);
        // adjust level based on success/failure
        let newLevel = action.payload.success
          ? currentLevel + 1
          : currentLevel - 1;
        newLevel = Math.max(1, Math.min(newLevel, 5)); // ensuring level stays between 1 and 5
        logger(newLevel, 'newLevel');

        const newUserWord: UserWord = {
          wordId: currentWord.id,
          level: newLevel,
          userId: action.payload.userId || '',
          attemptedAt: new Date(),
          id: Math.random(),
          success: action.payload.success,
        };

        // update the level of the current word and set the next word
        const updatedWords = state.allWords.map((word) => {
          if (word.id === currentWord.id) {
            const updatedUserWords = word.userWords
              ? [...word.userWords, newUserWord]
              : [newUserWord];
            return { ...word, userWords: updatedUserWords };
          }
          return word;
        });

        const oldWordIndex = state.filteredWords.findIndex(
          (word) => word.id === currentWord.id
        );

        const updatedFilteredWords = applyFilters(updatedWords, state.filters);
        const nextWordIndex = oldWordIndex + 1;
        logger(oldWordIndex, 'oldWordIndex');
        logger(nextWordIndex, 'nextWordIndex');
        const nextWord =
          updatedFilteredWords[
            nextWordIndex >= updatedFilteredWords.length ? 0 : nextWordIndex
          ];
        const noWords = updatedFilteredWords.length === 0;
        return {
          ...state,
          currentWord: nextWord,
          allWords: updatedWords,
          mode: calculateMode(nextWord),
          filteredWords: updatedFilteredWords,
          noWords: noWords,
        };
      }
      return state;
    }
    case 'SET_FILTERS': {
      // Merge the current filters with provided ones
      const updatedFilters = {
        levels: action.payload.levels || state.filters.levels,
        categories: action.payload.categories || state.filters.categories,
      };

      const filteredWords = state.allWords.filter((word) => {
        const wordLevel = calculateWordLevel(word);
        const isLevelMatch =
          updatedFilters.levels.length === 0 ||
          updatedFilters.levels.includes(wordLevel);
        const isCategoryMatch =
          updatedFilters.categories.length === 0 ||
          word.categories.some((wordCat) =>
            updatedFilters.categories.some(
              (category) => category.id === wordCat.wordcategorieId
            )
          );
        return isLevelMatch && isCategoryMatch;
      });
      let noWords = false;
      let nextCurrentWord = state.currentWord;
      if (
        filteredWords.length &&
        !filteredWords.includes(state.currentWord as PracticeWord)
      ) {
        nextCurrentWord = filteredWords[0];
      } else if (filteredWords.length === 0) {
        noWords = true;
        nextCurrentWord = null;
      }

      return {
        ...state,
        filters: updatedFilters,
        filteredWords: filteredWords,
        currentWord: nextCurrentWord,
        mode: nextCurrentWord ? calculateMode(nextCurrentWord) : 'english',
        noWords: noWords,
      };
    }
    case 'SHUFFLE_WORDS': {
      const shuffledAllWords = shuffleArray<(typeof state.allWords)[number]>([
        ...state.allWords,
      ]);
      const shuffledFilteredWords = shuffleArray<
        (typeof state.allWords)[number]
      >([...state.filteredWords]);
      const randomCurrentWord =
        shuffledFilteredWords[
          Math.floor(Math.random() * shuffledFilteredWords.length)
        ];

      return {
        ...state,
        allWords: shuffledAllWords,
        filteredWords: shuffledFilteredWords,
        currentWord: randomCurrentWord,
        mode: calculateMode(randomCurrentWord),
      };
    }
    case 'ADD_CATEGORY_TO_WORD': {
      if (state.currentWord === null) return state;
      const newCategory: WordUserCategorie = {
        addedAt: new Date(),
        id: Math.random(),
        userId: action.payload.userId,
        wordId: state.currentWord.id,
        wordcategorieId: action.payload.categoryId,
      };
      const updatedCurrentWord = state.currentWord.categories.some(
        (cat) => cat.wordcategorieId === action.payload.categoryId
      )
        ? state.currentWord
        : {
            ...state.currentWord,
            categories: [...state.currentWord.categories, newCategory],
          };
      const updatedAllWords = state.allWords.map((word) => {
        if (word.id === action.payload.wordId) {
          return updatedCurrentWord;
        } else {
          return word;
        }
      });
      const updatedFilteredWords = applyFilters(updatedAllWords, state.filters);
      const newCurrentWord = updatedFilteredWords.includes(
        state.currentWord as PracticeWord
      )
        ? updatedCurrentWord
        : updatedFilteredWords[0] || null;
      logger(newCurrentWord, 'newCurrentWord');
      return {
        ...state,
        allWords: updatedAllWords,
        filteredWords: updatedFilteredWords,
        currentWord: newCurrentWord,
      };
    }
    case 'REMOVE_CATEGORY_FROM_WORD': {
      if (state.currentWord === null) return state;
      const updatedCurrentWord = {
        ...state.currentWord,
        categories: state.currentWord?.categories.filter(
          (cat) => cat.wordcategorieId !== action.payload.categoryId
        ),
      };
      const updatedAllWords = state.allWords.map((word) => {
        if (word.id === action.payload.wordId) {
          return updatedCurrentWord;
        }
        return word;
      });
      const updatedFilteredWords = applyFilters(updatedAllWords, state.filters);
      const newCurrentWord = updatedFilteredWords.includes(
        state.currentWord as PracticeWord
      )
        ? updatedCurrentWord
        : updatedFilteredWords[0] || null;
      logger(newCurrentWord, 'newCurrentWord');
      const newMode =
        newCurrentWord?.id !== state.currentWord?.id && newCurrentWord
          ? calculateMode(newCurrentWord)
          : state.mode;
      return {
        ...state,
        allWords: updatedAllWords,
        filteredWords: updatedFilteredWords,
        currentWord: newCurrentWord,
        mode: newMode,
      };
    }

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload.mode,
      };

    default:
      return state;
  }
};

const WordPracticeContext = createContext<{
  state: WordPracticeContextState;
  dispatch: React.Dispatch<WordPracticeAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

type WordPracticeProviderProps = {
  children: React.ReactNode;
  initialWords: PracticeWords;
  availableCategories: WordCategorie[];
};

export const WordPracticeProvider: React.FC<WordPracticeProviderProps> = ({
  children,
  initialWords,
  availableCategories,
}) => {
  const [state, dispatch] = useReducer(wordPracticeReducer, {
    ...initialState,
    allWords: initialWords,
    filteredWords: initialWords,
    currentWord: initialWords[0] ? initialWords[0] : null,
    wordCategories: availableCategories,
    noWords: initialWords.length === 0,
  });

  return (
    <WordPracticeContext.Provider value={{ state, dispatch }}>
      {children}
    </WordPracticeContext.Provider>
  );
};

export const useWordPractice = () => {
  const context = useContext(WordPracticeContext);
  if (context === undefined) {
    throw new Error(
      'useWordPractice must be used within a WordPracticeProvider'
    );
  }
  return context;
};
