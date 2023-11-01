import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { 
  TestId, 
  NewTestParams,
  UpdateTestParams, 
  updateTestSchema,
  insertTestSchema, 
  tests,
  testIdSchema 
} from "@/lib/db/schema/tests";

export const createTest = async (test: NewTestParams) => {
  const newTest = insertTestSchema.parse(test);
  try {
    await db.insert(tests).values(newTest)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTest = async (id: TestId, test: UpdateTestParams) => {
  const { id: testId } = testIdSchema.parse({ id });
  const newTest = updateTestSchema.parse(test);
  try {
    await db
     .update(tests)
     .set(newTest)
     .where(eq(tests.id, testId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteTest = async (id: TestId) => {
  const { id: testId } = testIdSchema.parse({ id });
  try {
    await db.delete(tests).where(eq(tests.id, testId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

