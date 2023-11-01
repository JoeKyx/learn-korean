import { date, mysqlTable,serial } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getTests2 } from "@/lib/api/tests2/queries";

export const tests2 = mysqlTable('tests2', {
  id: serial("id").primaryKey(),
  date: date("date").notNull()
});


// Schema for tests2 - used to validate API requests
export const insertTestsSchema = createInsertSchema(tests2);

export const insertTestsParams = createSelectSchema(tests2, {
  date: z.coerce.string()
}).omit({ 
  id: true
});

export const updateTestsSchema = createSelectSchema(tests2);

export const updateTestsParams = createSelectSchema(tests2,{
  date: z.coerce.string()
})

export const testsIdSchema = updateTestsSchema.pick({ id: true });

// Types for tests2 - used to type API request params and within Components
export type Tests = z.infer<typeof updateTestsSchema>;
export type NewTests = z.infer<typeof insertTestsSchema>;
export type NewTestsParams = z.infer<typeof insertTestsParams>;
export type UpdateTestsParams = z.infer<typeof updateTestsParams>;
export type TestsId = z.infer<typeof testsIdSchema>["id"];
    
// this type infers the return from getTests2() - meaning it will include any joins
export type CompleteTests = Awaited<ReturnType<typeof getTests2>>["tests2"][number];

