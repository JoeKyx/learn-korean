import {eq } from "drizzle-orm";

import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import {userSettings } from "@/lib/db/schema/userSettings";

export const getUserSettings = async () => {
  const { session } = await getUserAuth();
  if(!session?.user.id) throw new Error("User not logged in");

  const [u] = await db.select().from(userSettings).where(eq(userSettings.userId, session?.user.id));
  return { userSettings: u };
};

