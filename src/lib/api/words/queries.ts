import {eq, isNull, or, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { userWords } from "@/lib/db/schema/userWords";
import { type WordId, wordIdSchema, words } from "@/lib/db/schema/words";
import { getUserAuth } from "@/lib/auth/utils";
import { wordUserCategories } from "@/lib/db/schema/wordUserCategories";

export const getWords = async () => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");

  const w = await db.select({ word: words }).from(words).where(or(eq(words.userId, session.user.id), isNull(words.userId)));
  return { words: w };
};

export const getWordWithUserWords = async (id: WordId) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");
  const { id: wordId } = wordIdSchema.parse({ id });
  const w = await db.select().from(words).leftJoin(userWords, eq(userWords.wordId, words.id)).where(and(eq(words.id, wordId), or(eq(words.userId, session.user.id), isNull(words.userId))));
  const categories = await db.select().from(wordUserCategories).where(and(eq(wordUserCategories.wordId, wordId), eq(wordUserCategories.userId, session.user.id)));
  const word = {...w[0].words, userWords: w.map(row => row.user_words), categories: categories}
  return { word };
}

export const getWordById = async (id: WordId) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");
  const { id: wordId } = wordIdSchema.parse({ id });
  const [w] = await db.select().from(words).where(and(eq(words.id, wordId), or(eq(words.userId, session.user.id), isNull(words.userId))));
  return { word: w };
};

export const getWordsByLessonId = async (lessonId: number|string) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");
  const lessonIdNumber = Number(lessonId)
  const w = await db.select().from(words).where(and(eq(words.lessonId, lessonIdNumber), or(eq(words.userId, session.user.id), isNull(words.userId))));
  return { words: w };
}

