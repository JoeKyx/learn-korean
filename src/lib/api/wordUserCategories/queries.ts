import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type WordUserCategorieId, wordUserCategorieIdSchema, wordUserCategories } from "@/lib/db/schema/wordUserCategories";
import { words } from "@/lib/db/schema/words";
import { wordCategories } from "@/lib/db/schema/wordCategories";

export const getWordUserCategories = async () => {
  const { session } = await getUserAuth();
  const w = await db.select({ wordUserCategorie: wordUserCategories, word: words, wordCategorie: wordCategories }).from(wordUserCategories).leftJoin(words, eq(wordUserCategories.wordId, words.id)).leftJoin(wordCategories, eq(wordUserCategories.wordcategorieId, wordCategories.id)).where(eq(wordUserCategories.userId, session?.user.id!));
  return { wordUserCategories: w };
};

export const getWordUserCategorieById = async (id: WordUserCategorieId) => {
  const { session } = await getUserAuth();
  const { id: wordUserCategorieId } = wordUserCategorieIdSchema.parse({ id });
  const [w] = await db.select().from(wordUserCategories).where(and(eq(wordUserCategories.id, wordUserCategorieId), eq(wordUserCategories.userId, session?.user.id!))).leftJoin(words, eq(wordUserCategories.wordId, words.id)).leftJoin(wordCategories, eq(wordUserCategories.wordcategorieId, wordCategories.id));
  return { wordUserCategorie: w };
};

