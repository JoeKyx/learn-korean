import { and, eq } from 'drizzle-orm';

import { getCardDesignById } from '@/lib/api/cardDesigns/queries';
import { getAmountOfSwipes } from '@/lib/api/userWords/queries';
import { getUserAuth } from '@/lib/auth/utils';
import { ACHIEVMENTS } from '@/lib/data';
import { db } from '@/lib/db';
import {
  insertUserCardSchema,
  NewUserCardParams,
  UpdateUserCardParams,
  updateUserCardSchema,
  UserCardId,
  userCardIdSchema,
  userCards,
} from '@/lib/db/schema/userCards';
import { Achievment } from '@/lib/types';

export const updateUserCards = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw Error('User ID is required');
  const userCardsRes = await db
    .select()
    .from(userCards)
    .where(eq(userCards.userId, session?.user.id));
  const wordsPracticed = await getAmountOfSwipes();

  const cardSwipeAchievments = ACHIEVMENTS.filter(
    (achievment) => achievment.type === 'card' && achievment.check === 'swipes'
  );

  const achievments = [] as Achievment[];
  for (const achievment of cardSwipeAchievments) {
    if (wordsPracticed >= achievment.goal) {
      const userCard = userCardsRes.find(
        (userCard) => userCard.carddesignId === achievment.id
      );
      if (!userCard) {
        await db.insert(userCards).values({
          userId: session?.user.id,
          carddesignId: achievment.id,
          unlockedAt: new Date(),
        });
        const unlockedCard = await getCardDesignById(achievment.id);
        achievments.push({
          name: unlockedCard.cardDesign.name,
          description: unlockedCard.cardDesign.description,
          type: 'card',
          image: unlockedCard.cardDesign.imageUrl,
        });
      }
    }
  }
  return achievments;
};

export const createUserCard = async (userCard: NewUserCardParams) => {
  const { session } = await getUserAuth();
  const newUserCard = insertUserCardSchema.parse({
    ...userCard,
    userId: session?.user.id,
  });
  try {
    await db.insert(userCards).values(newUserCard);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const updateUserCard = async (
  id: UserCardId,
  userCard: UpdateUserCardParams
) => {
  const { session } = await getUserAuth();
  if (!session || !session?.user.id) throw new Error('User not logged in');
  const { id: userCardId } = userCardIdSchema.parse({ id });
  const newUserCard = updateUserCardSchema.parse({
    ...userCard,
    userId: session?.user.id,
  });
  try {
    await db
      .update(userCards)
      .set(newUserCard)
      .where(
        and(
          eq(userCards.id, userCardId),
          eq(userCards.userId, session?.user.id)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const deleteUserCard = async (id: UserCardId) => {
  const { session } = await getUserAuth();
  if (!session || !session?.user.id) throw new Error('User not logged in');
  const { id: userCardId } = userCardIdSchema.parse({ id });
  try {
    await db
      .delete(userCards)
      .where(
        and(
          eq(userCards.id, userCardId),
          eq(userCards.userId, session?.user.id)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};
