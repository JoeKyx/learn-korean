import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  insertLanguageSchema,
  LanguageId,
  languageIdSchema,
  languages,
  NewLanguageParams,
  UpdateLanguageParams,
  updateLanguageSchema,
} from '@/lib/db/schema/languages';

export const createLanguage = async (language: NewLanguageParams) => {
  const newLanguage = insertLanguageSchema.parse(language);
  try {
    await db.insert(languages).values(newLanguage);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const updateLanguage = async (
  id: LanguageId,
  language: UpdateLanguageParams
) => {
  const { id: languageId } = languageIdSchema.parse({ id });
  const newLanguage = updateLanguageSchema.parse(language);
  try {
    await db
      .update(languages)
      .set(newLanguage)
      .where(eq(languages.id, languageId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const deleteLanguage = async (id: LanguageId) => {
  const { id: languageId } = languageIdSchema.parse({ id });
  try {
    await db.delete(languages).where(eq(languages.id, languageId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};
