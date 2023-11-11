import { and, eq } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import {
  insertLastLessonSchema,
  LastLessonId,
  lastLessonIdSchema,
  lastLessons,
  NewLastLessonParams,
  UpdateLastLessonParams,
  updateLastLessonSchema,
} from '@/lib/db/schema/lastLessons';

export const createLastLesson = async (lastLesson: NewLastLessonParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const newLastLesson = insertLastLessonSchema.parse({
    ...lastLesson,
    userId: session?.user.id,
    createdAt: new Date(),
  });
  try {
    await db.insert(lastLessons).values(newLastLesson);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const updateLastLesson = async (
  id: LastLessonId,
  lastLesson: UpdateLastLessonParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');

  const { id: lastLessonId } = lastLessonIdSchema.parse({ id });
  const newLastLesson = updateLastLessonSchema.parse({
    ...lastLesson,
    userId: session?.user.id,
  });
  try {
    await db
      .update(lastLessons)
      .set(newLastLesson)
      .where(
        and(
          eq(lastLessons.id, lastLessonId),
          eq(lastLessons.userId, session?.user.id)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const deleteLastLesson = async (id: LastLessonId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');

  const { id: lastLessonId } = lastLessonIdSchema.parse({ id });
  try {
    await db
      .delete(lastLessons)
      .where(
        and(
          eq(lastLessons.id, lastLessonId),
          eq(lastLessons.userId, session?.user.id)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};
