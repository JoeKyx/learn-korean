import { varchar, int, boolean, serial, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { languages } from "./languages"
import { getTestingModels } from "@/lib/api/testingModels/queries";

export const testingModels = mysqlTable('testing_models', {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  anumbers: int("anumbers").notNull(),
  aBoolean: boolean("a_boolean").notNull(),
  languageId: int("language_id").notNull()
});


// Schema for testingModels - used to validate API requests
export const insertTestingModelSchema = createInsertSchema(testingModels);

export const insertTestingModelParams = createSelectSchema(testingModels, {
  anumbers: z.coerce.number(),
  aBoolean: z.coerce.boolean(),
  languageId: z.coerce.number()
}).omit({ 
  id: true
});

export const updateTestingModelSchema = createSelectSchema(testingModels);

export const updateTestingModelParams = createSelectSchema(testingModels,{
  anumbers: z.coerce.number(),
  aBoolean: z.coerce.boolean(),
  languageId: z.coerce.number()
})

export const testingModelIdSchema = updateTestingModelSchema.pick({ id: true });

// Types for testingModels - used to type API request params and within Components
export type TestingModel = z.infer<typeof updateTestingModelSchema>;
export type NewTestingModel = z.infer<typeof insertTestingModelSchema>;
export type NewTestingModelParams = z.infer<typeof insertTestingModelParams>;
export type UpdateTestingModelParams = z.infer<typeof updateTestingModelParams>;
export type TestingModelId = z.infer<typeof testingModelIdSchema>["id"];
    
// this type infers the return from getTestingModels() - meaning it will include any joins
export type CompleteTestingModel = Awaited<ReturnType<typeof getTestingModels>>["testingModels"][number];

