import { and, eq } from "drizzle-orm";

import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { WordCategorieId, wordCategorieIdSchema } from "@/lib/db/schema/wordCategories";
import { WordId, wordIdSchema } from "@/lib/db/schema/words";
import {
  insertWordUserCategorieSchema, 
  NewWordUserCategorieParams,
  UpdateWordUserCategorieParams, 
  updateWordUserCategorieSchema,
  WordUserCategorieId, 
  wordUserCategorieIdSchema ,
  wordUserCategories} from "@/lib/db/schema/wordUserCategories";
import logger from "@/lib/logger";

export const createWordUserCategorie = async (wordUserCategorie: NewWordUserCategorieParams) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not found")

  const newWordUserCategorie = insertWordUserCategorieSchema.parse({ ...wordUserCategorie, userId: session.user.id });
  try {
    await db.insert(wordUserCategories).values(newWordUserCategorie)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateWordUserCategorie = async (id: WordUserCategorieId, wordUserCategorie: UpdateWordUserCategorieParams) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not found")

  const { id: wordUserCategorieId } = wordUserCategorieIdSchema.parse({ id });
  const newWordUserCategorie = updateWordUserCategorieSchema.parse({ ...wordUserCategorie, userId: session.user.id });
  try {
    await db
     .update(wordUserCategories)
     .set(newWordUserCategorie)
     .where(and(eq(wordUserCategories.id, wordUserCategorieId), eq(wordUserCategories.userId, session.user.id)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteWordUserCategorie = async (id: WordUserCategorieId) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not found")

  const { id: wordUserCategorieId } = wordUserCategorieIdSchema.parse({ id });
  try {
    await db.delete(wordUserCategories).where(and(eq(wordUserCategories.id, wordUserCategorieId), eq(wordUserCategories.userId, session.user.id)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteWordUserCategoryByCategoryId = async ({wordId, wordcategorieId}: {wordId: WordId, wordcategorieId: WordCategorieId }) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) {
    throw Error("User is not logged in")
  }
  const {id: parsedWordCategorieId} = wordCategorieIdSchema.parse({id: wordcategorieId});
  const {id: parsedWordId} = wordIdSchema.parse({id: wordId})

  try {
    logger({parsedWordCategorieId, parsedWordId}, 'Deleting')
    await db.delete(wordUserCategories).where(and(eq(wordUserCategories.wordcategorieId, parsedWordCategorieId), eq(wordUserCategories.userId, session.user.id), eq(wordUserCategories.wordId, parsedWordId)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }

}
