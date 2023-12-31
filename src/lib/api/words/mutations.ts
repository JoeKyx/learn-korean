import { and, eq } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import {
  insertWordSchema,
  NewWordParams,
  UpdateWordParams,
  updateWordSchema,
  WordId,
  wordIdSchema,
  words,
} from '@/lib/db/schema/words';
import logger from '@/lib/logger';

export const createWord = async (word: NewWordParams) => {
  const newWord = insertWordSchema.parse({ ...word });
  try {
    logger(newWord, 'inserting');
    await db.insert(words).values(newWord);
    logger(newWord, 'inserted');
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    logger(message);
    return { error: message };
  }
};

export const updateWord = async (id: WordId, word: UpdateWordParams) => {
  const { id: wordId } = wordIdSchema.parse({ id });
  const newWord = updateWordSchema.parse({ ...word });
  try {
    if (!wordId) throw Error('Word ID is required');
    await db.update(words).set(newWord).where(eq(words.id, wordId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const deleteWord = async (id: WordId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw Error('User ID is required');

  const { id: wordId } = wordIdSchema.parse({ id });
  try {
    await db
      .delete(words)
      .where(and(eq(words.id, wordId), eq(words.userId, session.user.id)));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    logger(message);
    return { error: message };
  }
};
