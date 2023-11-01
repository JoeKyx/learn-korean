import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  type LanguageId,
  languageIdSchema,
  languages,
} from '@/lib/db/schema/languages';

export const getLanguages = async () => {
  const l = await db.select().from(languages);
  return { languages: l };
};

export const getLanguageById = async (id: LanguageId) => {
  const { id: languageId } = languageIdSchema.parse({ id });
  const [l] = await db
    .select()
    .from(languages)
    .where(eq(languages.id, languageId));
  return { language: l };
};
