import { and, eq } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { cardDesigns } from '@/lib/db/schema/cardDesigns';
import {
  type UserCardId,
  userCardIdSchema,
  userCards,
} from '@/lib/db/schema/userCards';

export const getUserCards = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const u = await db
    .select({ userCard: userCards, cardDesign: cardDesigns })
    .from(userCards)
    .leftJoin(cardDesigns, eq(userCards.carddesignId, cardDesigns.id))
    .where(eq(userCards.userId, session?.user.id));
  return { userCards: u };
};

export const getUserCardById = async (id: UserCardId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const { id: userCardId } = userCardIdSchema.parse({ id });
  const [u] = await db
    .select()
    .from(userCards)
    .where(
      and(eq(userCards.id, userCardId), eq(userCards.userId, session?.user.id))
    )
    .leftJoin(cardDesigns, eq(userCards.carddesignId, cardDesigns.id));
  return { userCard: u };
};
