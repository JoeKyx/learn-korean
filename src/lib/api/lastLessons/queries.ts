import { and, desc, eq } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { LanguageId, languages } from '@/lib/db/schema/languages';
import {
  type LastLessonId,
  lastLessonIdSchema,
  lastLessons,
} from '@/lib/db/schema/lastLessons';
import { lessons } from '@/lib/db/schema/lessons';

export const getLastLessons = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const l = await db
    .select({ lastLesson: lastLessons, lesson: lessons, language: languages })
    .from(lastLessons)
    .leftJoin(lessons, eq(lastLessons.lessonId, lessons.id))
    .where(eq(lastLessons.userId, session?.user.id));
  return { lastLessons: l };
};

export const getLastLessonById = async (id: LastLessonId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const { id: lastLessonId } = lastLessonIdSchema.parse({ id });
  const [l] = await db
    .select()
    .from(lastLessons)
    .where(
      and(
        eq(lastLessons.id, lastLessonId),
        eq(lastLessons.userId, session?.user.id)
      )
    )
    .leftJoin(lessons, eq(lastLessons.lessonId, lessons.id));
  return { lastLesson: l };
};

export const getLastLessonByLanguageId = async (languageId: LanguageId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const [l] = await db
    .select()
    .from(lastLessons)
    .leftJoin(lessons, eq(lastLessons.lessonId, lessons.id))
    .where(
      and(
        eq(lastLessons.userId, session?.user.id),
        eq(lessons.languageId, languageId)
      )
    )
    .orderBy(desc(lastLessons.createdAt))
    .limit(1);
  return { lastLesson: l?.lessons };
};
