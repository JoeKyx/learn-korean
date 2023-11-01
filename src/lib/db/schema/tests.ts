import { mysqlTable,serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getTests } from "@/lib/api/tests/queries";

export const tests = mysqlTable('tests', {
  id: serial("id").primaryKey(),
  test: varchar("test", { length: 256 }).notNull()
});


// Schema for tests - used to validate API requests
export const insertTestSchema = createInsertSchema(tests);

export const insertTestParams = createSelectSchema(tests, {}).omit({ 
  id: true
});

export const updateTestSchema = createSelectSchema(tests);

export const updateTestParams = createSelectSchema(tests,{})

export const testIdSchema = updateTestSchema.pick({ id: true });

// Types for tests - used to type API request params and within Components
export type Test = z.infer<typeof updateTestSchema>;
export type NewTest = z.infer<typeof insertTestSchema>;
export type NewTestParams = z.infer<typeof insertTestParams>;
export type UpdateTestParams = z.infer<typeof updateTestParams>;
export type TestId = z.infer<typeof testIdSchema>["id"];
    
// this type infers the return from getTests() - meaning it will include any joins
export type CompleteTest = Awaited<ReturnType<typeof getTests>>["tests"][number];

