import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { type TestsId, tests2, testsIdSchema } from '@/lib/db/schema/tests2';

export const getTests2 = async () => {
  const t = await db.select().from(tests2);
  return { tests2: t };
};

export const getTestsById = async (id: TestsId) => {
  const { id: testsId } = testsIdSchema.parse({ id });
  const [t] = await db.select().from(tests2).where(eq(tests2.id, testsId));
  return { tests: t };
};
