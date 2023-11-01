import { and, eq, isNull, or, sql } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { LanguageId } from '@/lib/db/schema/languages';
import {
  LessonCategorieId,
  lessonCategories,
} from '@/lib/db/schema/lessonCategories';
import {
  type LessonId,
  Lesson,
  lessonIdSchema,
  lessons,
} from '@/lib/db/schema/lessons';
import {
  UserWord,
  userWords,
  WordWithUserWords,
} from '@/lib/db/schema/userWords';
import { Word, words } from '@/lib/db/schema/words';
import { wordUserCategories } from '@/lib/db/schema/wordUserCategories';
import logger from '@/lib/logger';

export const getLessons = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw Error('User ID is required');
  const l = await db
    .select()
    .from(lessons)
    .where(or(isNull(lessons.userId), eq(lessons.userId, session.user.id)));
  return { lessons: l };
};

export const getLessonsWithCategory = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw Error('User ID is required');
  const l = await db
    .select()
    .from(lessons)
    .innerJoin(
      lessonCategories,
      eq(lessonCategories.id, lessons.lessonCategoryId)
    )
    .where(or(isNull(lessons.userId), eq(lessons.userId, session.user.id)));

  // Define the structure of the grouped lessons
  type GroupedLesson = {
    id: number;
    name: string;
    image?: string;
    lessons: Lesson[];
  };

  const groupedLessons: { [key: number]: GroupedLesson } = l.reduce<{
    [key: number]: GroupedLesson;
  }>((acc, lessonWithCategory) => {
    const categoryId = lessonWithCategory.lesson_categories.id;
    const categoryName = lessonWithCategory.lesson_categories.name;

    // If the category hasn't been added to acc, add it with an empty lessons array
    if (!acc[categoryId]) {
      acc[categoryId] = {
        id: categoryId,
        name: categoryName,
        image: lessonWithCategory.lesson_categories.image
          ? lessonWithCategory.lesson_categories.image
          : undefined,
        lessons: [],
      };
    }

    // Push the lesson to the correct category's lessons array
    acc[categoryId].lessons.push(lessonWithCategory.lessons);

    return acc;
  }, {});

  return { categories: groupedLessons };
};

export const getAllLessons = async () => {
  const l = await db.select().from(lessons);
  return { lessons: l };
};

export const getLessonById = async (id: LessonId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw Error('User ID is required');
  const { id: lessonId } = lessonIdSchema.parse({ id });
  const [l] = await db
    .select()
    .from(lessons)
    .where(
      and(
        eq(lessons.id, lessonId),
        or(isNull(lessons.userId), eq(lessons.userId, session.user.id))
      )
    );
  return { lesson: l };
};

export const getPracticeLessonByCategory = async (
  languageId: LanguageId,
  lessonCategoryId: LessonCategorieId
) => {
  const { session } = await getUserAuth();
  let l = [];
  if (!session?.user.id) throw Error('User ID is required');
  const { id: categoryId } = lessonIdSchema.parse({ id: lessonCategoryId });
  logger(lessonCategoryId, 'lessonCategoryId');
  const latestAttemptSubquery = db
    .select({
      wordId: userWords.wordId,
      lastAttempt: sql<Date>`max(attempted_at)`.as('lastAttempt'),
    })
    .from(userWords)
    .where(eq(userWords.userId, session.user.id))
    .groupBy(userWords.wordId)
    .as('latest_attempt'); // Alias for the subquery
  const result = await db
    .select()
    .from(lessons)
    .innerJoin(words, eq(words.lessonId, lessons.id))
    .leftJoin(
      userWords,
      and(eq(userWords.wordId, words.id), eq(userWords.userId, session.user.id))
    )
    .leftJoin(latestAttemptSubquery, eq(latestAttemptSubquery.wordId, words.id))
    .where(
      and(
        eq(lessons.lessonCategoryId, categoryId),
        or(isNull(lessons.userId), eq(lessons.userId, session.user.id)),
        or(
          eq(userWords.attemptedAt, latestAttemptSubquery.lastAttempt),
          isNull(userWords.attemptedAt)
        )
      )
    );
  l = result;
  logger(l, 'l');
  const practiceLesson = await generatePracticeLesson(l, false, languageId);
  logger(practiceLesson, 'getPracticeLessonByCategory');
  return { lesson: practiceLesson };
};

export const getPracticeLessons = async (
  onlyLatestAttempt: boolean,
  id?: LessonId,
  languageId?: LanguageId,
  onlyAlreadyPracticed?: boolean
) => {
  const { session } = await getUserAuth();
  let l = [];
  if (!session?.user.id) throw Error('User ID is required');
  if (!onlyLatestAttempt) {
    if (id) {
      const { id: lessonId } = lessonIdSchema.parse({ id });
      const result = await db
        .select()
        .from(lessons)
        .innerJoin(words, eq(words.lessonId, lessons.id))
        .leftJoin(
          userWords,
          and(
            eq(userWords.wordId, words.id),
            eq(userWords.userId, session.user.id)
          )
        )
        .where(and(eq(lessons.id, lessonId)));
      l = result;
    } else {
      const result = await db
        .select()
        .from(lessons)
        .innerJoin(words, eq(words.lessonId, lessons.id))
        .leftJoin(
          userWords,
          and(
            eq(userWords.wordId, words.id),
            eq(userWords.userId, session.user.id)
          )
        )
        .where(or(isNull(lessons.userId), eq(lessons.userId, session.user.id)));
      l = result;
    }
  } else {
    const latestAttemptSubquery = db
      .select({
        wordId: userWords.wordId,
        lastAttempt: sql<Date>`max(attempted_at)`.as('lastAttempt'),
      })
      .from(userWords)
      .where(eq(userWords.userId, session.user.id))
      .groupBy(userWords.wordId)
      .as('latest_attempt'); // Alias for the subquery
    if (id) {
      const result = await db
        .select()
        .from(lessons)
        .innerJoin(words, eq(words.lessonId, lessons.id))
        .leftJoin(
          userWords,
          and(
            eq(userWords.wordId, words.id),
            eq(userWords.userId, session.user.id)
          )
        )
        .leftJoin(
          latestAttemptSubquery,
          eq(userWords.wordId, latestAttemptSubquery.wordId)
        ) // Join the subquery
        .where(
          and(
            or(
              eq(userWords.attemptedAt, latestAttemptSubquery.lastAttempt),
              isNull(userWords.attemptedAt)
            ),
            eq(lessons.id, id)
          )
        );
      l = result;
    } else {
      const result = await db
        .select()
        .from(lessons)
        .innerJoin(words, eq(words.lessonId, lessons.id))
        .leftJoin(
          userWords,
          and(
            eq(userWords.wordId, words.id),
            eq(userWords.userId, session.user.id)
          )
        )
        .leftJoin(
          latestAttemptSubquery,
          eq(userWords.wordId, latestAttemptSubquery.wordId)
        ) // Join the subquery
        .where(
          and(
            eq(userWords.attemptedAt, latestAttemptSubquery.lastAttempt),
            or(isNull(lessons.userId), eq(lessons.userId, session.user.id))
          )
        );

      l = result;
    }
  }

  const practiceLesson = await generatePracticeLesson(
    l,
    onlyAlreadyPracticed || false,
    languageId
  );

  return { lesson: practiceLesson };
};

const generatePracticeLesson = async (
  l: { lessons: Lesson; words: Word; user_words: UserWord | null }[],
  onlyAlreadyPracticed: boolean,
  languageId?: LanguageId
) => {
  logger(onlyAlreadyPracticed, 'onlyAlreadyPracticed');
  logger(languageId, 'languageId');

  const { session } = await getUserAuth();
  if (!session?.user.id) throw Error('User ID is required');
  const practiceLesson = {
    words: [] as WordWithUserWords[],
  };

  const wordsMap: { [key: string]: WordWithUserWords } = {};
  logger(wordsMap, 'wordsMap');
  logger(l, 'l');

  // Wrap all async operations inside an array of promises
  const promises = l.map(async (row) => {
    logger(row, 'row');
    logger(languageId);
    if (languageId && row.lessons.languageId !== languageId) return;
    if (!wordsMap[row.words.id]) {
      const categories = await db
        .select()
        .from(wordUserCategories)
        .where(
          and(
            eq(wordUserCategories.wordId, row.words.id),
            eq(wordUserCategories.userId, session.user.id)
          )
        );
      wordsMap[row.words.id] = {
        ...row.words,
        categories: categories,
        userWords: [],
      };

      practiceLesson.words.push(wordsMap[row.words.id]);
    }
    if (row.user_words?.id) {
      wordsMap[row.words.id].userWords.push(row.user_words);

      practiceLesson.words = practiceLesson.words.map(
        (word: WordWithUserWords) => {
          if (word.id === row.words.id) {
            return {
              ...word,
              userWords: [...word.userWords, row.user_words],
            };
          }
          return word;
        }
      );
    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  if (onlyAlreadyPracticed) {
    practiceLesson.words = practiceLesson.words.filter(
      (word: WordWithUserWords) => {
        return word.userWords.length > 0;
      }
    );
  }
  logger(practiceLesson, 'practiceLesson');
  return practiceLesson;
};
