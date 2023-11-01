import { and,eq } from "drizzle-orm";

import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { LanguageId } from "@/lib/db/schema/languages";
import { lessons } from "@/lib/db/schema/lessons";
import { type UserWordId, userWordIdSchema, userWords } from "@/lib/db/schema/userWords";
import { words } from "@/lib/db/schema/words";

export const getUserWords = async () => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw Error("User ID is required")
  const u = await db.select({ userWord: userWords, word: words }).from(userWords).leftJoin(words, eq(userWords.wordId, words.id)).where(eq(userWords.userId, session?.user.id));
  return { userWords: u };
};

export const getUserWordById = async (id: UserWordId) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw Error("User ID is required")
  const { id: userWordId } = userWordIdSchema.parse({ id });
  const [u] = await db.select().from(userWords).where(and(eq(userWords.id, userWordId), eq(userWords.userId, session?.user.id))).leftJoin(words, eq(userWords.wordId, words.id));
  return { userWord: u };
};

export const getUserWordsByLessonId = async (lessonId: number|string) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw Error("User ID is required")
  const lessonIdNumber = Number(lessonId)
  const u = await db.select().from(userWords).innerJoin(words, eq(userWords.wordId, words.id)).innerJoin(lessons, eq(words.lessonId, lessons.id)).where(and(eq(lessons.id, lessonIdNumber), eq(userWords.userId, session?.user.id)));
  return { userWords: u };
}

export const getAmountOfWordsPractied = async (languageId: LanguageId) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw Error("User ID is required")
  const u = await db.select({words: userWords.wordId}).from(userWords).innerJoin(words, eq(userWords.wordId, words.id)).innerJoin(lessons, eq(lessons.id, words.lessonId)).where(and(eq(userWords.userId, session?.user.id), eq(lessons.languageId, languageId ||1))).groupBy(userWords.wordId);
  return u.length;
}