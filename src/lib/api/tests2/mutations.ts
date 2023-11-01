import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { 
  insertTestsSchema, 
  NewTestsParams,
  tests2,
  TestsId, 
  testsIdSchema, 
  UpdateTestsParams, 
  updateTestsSchema} from "@/lib/db/schema/tests2";

export const createTests = async (tests: NewTestsParams) => {
  const newTests = insertTestsSchema.parse(tests);
  try {
    await db.insert(tests2).values(newTests)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTests = async (id: TestsId, tests: UpdateTestsParams) => {
  const { id: testsId } = testsIdSchema.parse({ id });
  const newTests = updateTestsSchema.parse(tests);
  try {
    await db
     .update(tests2)
     .set(newTests)
     .where(eq(tests2.id, testsId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteTests = async (id: TestsId) => {
  const { id: testsId } = testsIdSchema.parse({ id });
  try {
    await db.delete(tests2).where(eq(tests2.id, testsId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

