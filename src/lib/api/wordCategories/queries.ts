import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { type WordCategorieId, wordCategorieIdSchema, wordCategories } from "@/lib/db/schema/wordCategories";

export const getWordCategories = async () => {
  const w = await db.select().from(wordCategories);
  return { wordCategories: w };
};

export const getWordCategorieById = async (id: WordCategorieId) => {
  const { id: wordCategorieId } = wordCategorieIdSchema.parse({ id });
  const [w] = await db.select().from(wordCategories).where(eq(wordCategories.id, wordCategorieId));
  return { wordCategorie: w };
};

