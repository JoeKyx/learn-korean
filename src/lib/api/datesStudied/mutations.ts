import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { 
  DatesStudieId, 
  NewDatesStudieParams,
  UpdateDatesStudieParams, 
  updateDatesStudieSchema,
  insertDatesStudieSchema, 
  datesStudied,
  datesStudieIdSchema 
} from "@/lib/db/schema/datesStudied";
import { getUserAuth } from "@/lib/auth/utils";

export const createDatesStudie = async (datesStudie: NewDatesStudieParams) => {
  const { session } = await getUserAuth();
  const newDatesStudie = insertDatesStudieSchema.parse({ ...datesStudie, userId: session?.user.id! });
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
  const { id: datesStudieId } = datesStudieIdSchema.parse({ id });
  const newDatesStudie = updateDatesStudieSchema.parse({ ...datesStudie, userId: session?.user.id! });
  try {
    await db
     .update(datesStudied)
     .set(newDatesStudie)
     .where(and(eq(datesStudied.id, datesStudieId!), eq(datesStudied.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteDatesStudie = async (id: DatesStudieId) => {
  const { session } = await getUserAuth();
  const { id: datesStudieId } = datesStudieIdSchema.parse({ id });
  try {
    await db.delete(datesStudied).where(and(eq(datesStudied.id, datesStudieId!), eq(datesStudied.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

