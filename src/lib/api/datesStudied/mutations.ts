import { and, eq } from "drizzle-orm";

import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { 
  datesStudied,
  DatesStudieId, 
  datesStudieIdSchema, 
  insertDatesStudieSchema, 
  NewDatesStudieParams,
  UpdateDatesStudieParams, 
  updateDatesStudieSchema} from "@/lib/db/schema/datesStudied";

export const createDatesStudie = async (datesStudie: NewDatesStudieParams) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not found")
  const newDatesStudie = insertDatesStudieSchema.parse({ ...datesStudie, userId: session.user.id });
  try {
    await db.insert(datesStudied).values(newDatesStudie)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateDatesStudie = async (id: DatesStudieId, datesStudie: UpdateDatesStudieParams) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not found")

  const { id: datesStudieId } = datesStudieIdSchema.parse({ id });
  const newDatesStudie = updateDatesStudieSchema.parse({ ...datesStudie, userId: session.user.id });
  try {
    await db
     .update(datesStudied)
     .set(newDatesStudie)
     .where(and(eq(datesStudied.id, datesStudieId), eq(datesStudied.userId, session.user.id)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteDatesStudie = async (id: DatesStudieId) => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not found")

  const { id: datesStudieId } = datesStudieIdSchema.parse({ id });
  try {
    await db.delete(datesStudied).where(and(eq(datesStudied.id, datesStudieId), eq(datesStudied.userId, session.user.id)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

