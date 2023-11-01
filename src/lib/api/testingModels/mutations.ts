import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { 
  TestingModelId, 
  NewTestingModelParams,
  UpdateTestingModelParams, 
  updateTestingModelSchema,
  insertTestingModelSchema, 
  testingModels,
  testingModelIdSchema 
} from "@/lib/db/schema/testingModels";

export const createTestingModel = async (testingModel: NewTestingModelParams) => {
  const newTestingModel = insertTestingModelSchema.parse(testingModel);
  try {
    await db.insert(testingModels).values(newTestingModel)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTestingModel = async (id: TestingModelId, testingModel: UpdateTestingModelParams) => {
  const { id: testingModelId } = testingModelIdSchema.parse({ id });
  const newTestingModel = updateTestingModelSchema.parse(testingModel);
  try {
    await db
     .update(testingModels)
     .set(newTestingModel)
     .where(eq(testingModels.id, testingModelId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteTestingModel = async (id: TestingModelId) => {
  const { id: testingModelId } = testingModelIdSchema.parse({ id });
  try {
    await db.delete(testingModels).where(eq(testingModels.id, testingModelId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

