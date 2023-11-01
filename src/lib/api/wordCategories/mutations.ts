import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { 
  WordCategorieId, 
  NewWordCategorieParams,
  UpdateWordCategorieParams, 
  updateWordCategorieSchema,
  insertWordCategorieSchema, 
  wordCategories,
  wordCategorieIdSchema 
} from "@/lib/db/schema/wordCategories";

export const createWordCategorie = async (wordCategorie: NewWordCategorieParams) => {
  const newWordCategorie = insertWordCategorieSchema.parse(wordCategorie);
  try {
    await db.insert(wordCategories).values(newWordCategorie)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateWordCategorie = async (id: WordCategorieId, wordCategorie: UpdateWordCategorieParams) => {
  const { id: wordCategorieId } = wordCategorieIdSchema.parse({ id });
  const newWordCategorie = updateWordCategorieSchema.parse(wordCategorie);
  try {
    await db
     .update(wordCategories)
     .set(newWordCategorie)
     .where(eq(wordCategories.id, wordCategorieId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteWordCategorie = async (id: WordCategorieId) => {
  const { id: wordCategorieId } = wordCategorieIdSchema.parse({ id });
  try {
    await db.delete(wordCategories).where(eq(wordCategories.id, wordCategorieId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

