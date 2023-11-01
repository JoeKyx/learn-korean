import { and, eq, sql } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import {
  type DatesStudieId,
  datesStudied,
  datesStudieIdSchema,
} from '@/lib/db/schema/datesStudied';
import {
  LanguageId,
  languageIdSchema,
  languages,
} from '@/lib/db/schema/languages';
import { lessons } from '@/lib/db/schema/lessons';

export const getDatesStudies = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not found');

  const d = await db
    .select({ datesStudie: datesStudied, language: languages, lesson: lessons })
    .from(datesStudied)
    .leftJoin(languages, eq(datesStudied.languageId, languages.id))
    .leftJoin(lessons, eq(datesStudied.lessonId, lessons.id))
    .where(eq(datesStudied.userId, session.user.id));
  return { datesStudied: d };
};

export const getDatesStudieById = async (id: DatesStudieId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not found');

  const { id: datesStudieId } = datesStudieIdSchema.parse({ id });
  const [d] = await db
    .select()
    .from(datesStudied)
    .where(
      and(
        eq(datesStudied.id, datesStudieId),
        eq(datesStudied.userId, session.user.id)
      )
    )
    .leftJoin(languages, eq(datesStudied.languageId, languages.id))
    .leftJoin(lessons, eq(datesStudied.lessonId, lessons.id));
  return { datesStudie: d };
};

export const getDatesStudiedByLanguage = async (languageId: LanguageId) => {
  const { session } = await getUserAuth();
  const { id: languageIdParsed } = languageIdSchema.parse({ id: languageId });
  if (!session?.user.id) throw Error('User ID is required');
  const d = await db
    .select({
      datesStudie: datesStudied.date,
      attempts: sql<number>`sum(attempts)`,
      successful: sql<number>`sum(successful)`,
    })
    .from(datesStudied)
    .where(
      and(
        eq(datesStudied.userId, session.user.id),
        eq(datesStudied.languageId, languageIdParsed)
      )
    )
    .groupBy(datesStudied.date);
  return { datesStudied: d };
};
