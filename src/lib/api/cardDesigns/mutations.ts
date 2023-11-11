import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  CardDesignId,
  cardDesignIdSchema,
  cardDesigns,
  insertCardDesignSchema,
  NewCardDesignParams,
  UpdateCardDesignParams,
  updateCardDesignSchema,
} from '@/lib/db/schema/carddesigns';

export const createCardDesign = async (cardDesign: NewCardDesignParams) => {
  const newCardDesign = insertCardDesignSchema.parse(cardDesign);
  try {
    await db.insert(cardDesigns).values(newCardDesign);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const updateCardDesign = async (
  id: CardDesignId,
  cardDesign: UpdateCardDesignParams
) => {
  const { id: cardDesignId } = cardDesignIdSchema.parse({ id });
  const newCardDesign = updateCardDesignSchema.parse(cardDesign);
  try {
    await db
      .update(cardDesigns)
      .set(newCardDesign)
      .where(eq(cardDesigns.id, cardDesignId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const deleteCardDesign = async (id: CardDesignId) => {
  const { id: cardDesignId } = cardDesignIdSchema.parse({ id });
  try {
    await db.delete(cardDesigns).where(eq(cardDesigns.id, cardDesignId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};
