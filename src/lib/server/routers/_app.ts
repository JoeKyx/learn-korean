import { cardDesignsRouter } from './cardDesigns';
import { datesStudiedRouter } from './datesStudied';
import { languagesRouter } from './languages';
import { lastLessonsRouter } from './lastLessons';
import { lessonCategoriesRouter } from './lessonCategories';
import { lessonsRouter } from './lessons';
import { testingModelsRouter } from './testingModels';
import { testsRouter } from './tests';
import { tests2Router } from './tests2';
import { userCardsRouter } from './userCards';
import { userSettingsRouter } from './userSettings';
import { userWordsRouter } from './userWords';
import { wordCategoriesRouter } from './wordCategories';
import { wordsRouter } from './words';
import { wordUserCategoriesRouter } from './wordUserCategories';
import { router } from '../trpc';

export const appRouter = router({
  words: wordsRouter,
  lessons: lessonsRouter,
  userWords: userWordsRouter,
  tests: testsRouter,
  tests2: tests2Router,
  languages: languagesRouter,
  userSettings: userSettingsRouter,
  testingModels: testingModelsRouter,
  wordCategories: wordCategoriesRouter,
  wordUserCategories: wordUserCategoriesRouter,
  datesStudied: datesStudiedRouter,
  lessonCategories: lessonCategoriesRouter,
  lastLessons: lastLessonsRouter,
  cardDesigns: cardDesignsRouter,
  userCards: userCardsRouter,
});

export type AppRouter = typeof appRouter;
