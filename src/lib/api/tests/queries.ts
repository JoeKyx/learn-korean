import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { type TestId, testIdSchema, tests } from "@/lib/db/schema/tests";

export const getTests = async () => {
  const t = await db.select().from(tests);
  return { tests: t };
};

export const getTestById = async (id: TestId) => {
  const { id: testId } = testIdSchema.parse({ id });
  const [t] = await db.select().from(tests).where(eq(tests.id, testId));
  return { test: t };
};

