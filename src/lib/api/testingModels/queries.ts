import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { languages } from "@/lib/db/schema/languages";
import { type TestingModelId, testingModelIdSchema, testingModels } from "@/lib/db/schema/testingModels";

export const getTestingModels = async () => {
  const t = await db.select({ testingModel: testingModels, language: languages }).from(testingModels).leftJoin(languages, eq(testingModels.languageId, languages.id));
  return { testingModels: t };
};

export const getTestingModelById = async (id: TestingModelId) => {
  const { id: testingModelId } = testingModelIdSchema.parse({ id });
  const [t] = await db.select().from(testingModels).where(eq(testingModels.id, testingModelId)).leftJoin(languages, eq(testingModels.languageId, languages.id));
  return { testingModel: t };
};

