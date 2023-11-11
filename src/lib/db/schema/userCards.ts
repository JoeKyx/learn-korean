import {
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { getUserCards } from '@/lib/api/userCards/queries';

export const userCards = mysqlTable('user_cards', {
  id: serial('id').primaryKey(),
  carddesignId: int('cardDesign_id').notNull(),
  unlockedAt: timestamp('unlocked_at').notNull(),
  userId: varchar('user_id', { length: 256 }).notNull(),
});

// Schema for userCards - used to validate API requests
export const insertUserCardSchema = createInsertSchema(userCards);

export const insertUserCardParams = createSelectSchema(userCards, {
  carddesignId: z.coerce.number(),
  unlockedAt: z.coerce.string(),
}).omit({
  id: true,
  userId: true,
});

export const updateUserCardSchema = createSelectSchema(userCards);

export const updateUserCardParams = createSelectSchema(userCards, {
  carddesignId: z.coerce.number(),
  unlockedAt: z.coerce.string(),
}).omit({
  userId: true,
});

export const userCardIdSchema = updateUserCardSchema.pick({ id: true });

// Types for userCards - used to type API request params and within Components
export type UserCard = z.infer<typeof updateUserCardSchema>;
export type NewUserCard = z.infer<typeof insertUserCardSchema>;
export type NewUserCardParams = z.infer<typeof insertUserCardParams>;
export type UpdateUserCardParams = z.infer<typeof updateUserCardParams>;
export type UserCardId = z.infer<typeof userCardIdSchema>['id'];

// this type infers the return from getUserCards() - meaning it will include any joins
export type CompleteUserCard = Awaited<
  ReturnType<typeof getUserCards>
>['userCards'][number];
