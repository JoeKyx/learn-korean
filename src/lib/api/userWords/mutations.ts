import { and, eq } from 'drizzle-orm';

import {
  createDatesStudie,
  updateDatesStudie,
} from '@/lib/api/datesStudied/mutations';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { datesStudied } from '@/lib/db/schema/datesStudied';
import { lessons } from '@/lib/db/schema/lessons';
import {
  insertUserWordSchema,
  NewUserWordParams,
  UpdateUserWordParams,
  updateUserWordSchema,
  UserWordId,
  userWordIdSchema,
  userWords,
} from '@/lib/db/schema/userWords';
import { words } from '@/lib/db/schema/words';
import logger from '@/lib/logger';

export const createUserWord = async (userWord: NewUserWordParams) => {
  const { session } = await getUserAuth();
  const newUserWord = insertUserWordSchema.parse({
    ...userWord,
    userId: session?.user.id,
  });
  try {
    await db.insert(userWords).values(newUserWord);
    await addDateStudied(userWord);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    logger(message);
    return { error: message };
  }
};

const addDateStudied = async (userWord: NewUserWordParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw Error('User ID is required');
  try {
    // Check whether there already is an entry for the day, lesson, and user
    // If there is already an entry, update it. Increase attempts by one, and update either success or failed
    // If there is no entry yet, create one. Set attempts to 1, and update either success or failed
    const [lessonId] = await db
      .select({ lessondId: words.lessonId })
      .from(words)
      .where(eq(words.id, userWord.wordId));
    logger(lessonId.lessondId, 'We found this lessonId');
    const [dateStudied] = await db
      .select()
      .from(datesStudied)
      .where(
        and(
          eq(datesStudied.userId, session.user.id),
          eq(datesStudied.lessonId, lessonId.lessondId),
          eq(datesStudied.date, new Date().toISOString().substring(0, 10))
        )
      );
    logger(dateStudied, 'We found this dateStudied');
    if (dateStudied) {
      updateDatesStudie(dateStudied.id, {
        ...dateStudied,
        date: dateStudied.date,
        attempts: dateStudied.attempts + 1,
        successful: userWord.success
          ? dateStudied.successful + 1
          : dateStudied.successful,
        failed: userWord.success ? dateStudied.failed : dateStudied.failed + 1,
      });
    } else {
      const [lesson] = await db
        .select({ languageId: lessons.languageId })
        .from(lessons)
        .where(eq(lessons.id, lessonId.lessondId));
      createDatesStudie({
        date: new Date().toISOString().substring(0, 10),
        attempts: 1,
        successful: userWord.success ? 1 : 0,
        failed: userWord.success ? 0 : 1,
        languageId: lesson.languageId,
        lessonId: lessonId.lessondId,
      });
    }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    logger(message);
    return { error: message };
  }
};

export const updateUserWord = async (
  id: UserWordId,
  userWord: UpdateUserWordParams
) => {
  const { session } = await getUserAuth();
  const { id: userWordId } = userWordIdSchema.parse({ id });
  const newUserWord = updateUserWordSchema.parse({
    ...userWord,
    userId: session?.user.id,
  });
  try {
    if (!userWordId) throw Error('User Word ID is required');
    if (!session?.user.id) throw Error('User ID is required');
    await db
      .update(userWords)
      .set(newUserWord)
      .where(
        and(
          eq(userWords.id, userWordId),
          eq(userWords.userId, session?.user.id)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    logger(message);
    return { error: message };
  }
};

export const deleteUserWord = async (id: UserWordId) => {
  const { session } = await getUserAuth();
  const { id: userWordId } = userWordIdSchema.parse({ id });
  try {
    if (!userWordId) throw Error('User Word ID is required');
    if (!session?.user.id) throw Error('User ID is required');
    await db
      .delete(userWords)
      .where(
        and(
          eq(userWords.id, userWordId),
          eq(userWords.userId, session?.user.id)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    logger(message);
    return { error: message };
  }
};
