import { lessonsRouter } from "./lessons";
import { userWordsRouter } from "./userWords";
import { wordsRouter } from "./words";
import { router } from "../trpc";
import { testsRouter } from "./tests";
import { tests2Router } from "./tests2";
import { languagesRouter } from "./languages";
import { userSettingsRouter } from "./userSettings";
import { testingModelsRouter } from "./testingModels";
import { wordCategoriesRouter } from "./wordCategories";
import { wordUserCategoriesRouter } from "./wordUserCategories";
import { datesStudiedRouter } from "./datesStudied";
import { lessonCategoriesRouter } from "./lessonCategories";

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
});

export type AppRouter = typeof appRouter;
