import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { getCardDesigns } from '@/lib/api/cardDesigns/queries';

export const cardDesigns = mysqlTable('card_designs', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  imageUrl: varchar('image_url', { length: 256 }).notNull(),
});

// Schema for cardDesigns - used to validate API requests
export const insertCardDesignSchema = createInsertSchema(cardDesigns);

export const insertCardDesignParams = createSelectSchema(cardDesigns, {}).omit({
  id: true,
});

export const updateCardDesignSchema = createSelectSchema(cardDesigns);

export const updateCardDesignParams = createSelectSchema(cardDesigns, {});

export const cardDesignIdSchema = updateCardDesignSchema.pick({ id: true });

// Types for cardDesigns - used to type API request params and within Components
export type CardDesign = z.infer<typeof updateCardDesignSchema>;
export type NewCardDesign = z.infer<typeof insertCardDesignSchema>;
export type NewCardDesignParams = z.infer<typeof insertCardDesignParams>;
export type UpdateCardDesignParams = z.infer<typeof updateCardDesignParams>;
export type CardDesignId = z.infer<typeof cardDesignIdSchema>['id'];

// this type infers the return from getCardDesigns() - meaning it will include any joins
export type CompleteCardDesign = Awaited<
  ReturnType<typeof getCardDesigns>
>['cardDesigns'][number];
