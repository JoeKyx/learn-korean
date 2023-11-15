import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  type CardDesignId,
  cardDesignIdSchema,
  cardDesigns,
} from '@/lib/db/schema/cardDesigns';

export const getCardDesigns = async () => {
  const c = await db.select().from(cardDesigns);
  return { cardDesigns: c };
};

export const getCardDesignById = async (id: CardDesignId) => {
  const { id: cardDesignId } = cardDesignIdSchema.parse({ id });
  const [c] = await db
    .select()
    .from(cardDesigns)
    .where(eq(cardDesigns.id, cardDesignId));
  return { cardDesign: c };
};
