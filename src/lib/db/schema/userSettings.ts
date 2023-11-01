import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getUserSettings } from "@/lib/api/userSettings/queries";

export const userSettings = mysqlTable('user_settings', {
  languageId: int("language_id"),
  userId: varchar("user_id", { length: 256 }).primaryKey(),
});


// Schema for userSettings - used to validate API requests
export const insertUserSettingSchema = createInsertSchema(userSettings);

export const insertUserSettingParams = createSelectSchema(userSettings, {
  languageId: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateUserSettingSchema = createSelectSchema(userSettings);

export const updateUserSettingParams = createSelectSchema(userSettings,{
  languageId: z.coerce.number()
}).omit({ 
  userId: true
});

export const userSettingUserIdSchema = updateUserSettingSchema.pick({ userId: true });

// Types for userSettings - used to type API request params and within Components
export type UserSetting = z.infer<typeof updateUserSettingSchema>;
export type NewUserSetting = z.infer<typeof insertUserSettingSchema>;
export type NewUserSettingParams = z.infer<typeof insertUserSettingParams>;
export type UpdateUserSettingParams = z.infer<typeof updateUserSettingParams>;
export type UserId = z.infer<typeof userSettingUserIdSchema>["userId"];
    
// this type infers the return from getUserSettings() - meaning it will include any joins
export type CompleteUserSetting = Awaited<ReturnType<typeof getUserSettings>>["userSettings"];

