import { eq } from 'drizzle-orm';

import { getUserSettings } from '@/lib/api/userSettings/queries';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import {
  insertUserSettingSchema,
  NewUserSettingParams,
  UpdateUserSettingParams,
  updateUserSettingSchema,
  userSettings,
} from '@/lib/db/schema/userSettings';
import logger from '@/lib/logger';

export const createUserSetting = async (userSetting: NewUserSettingParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');

  const newUserSetting = insertUserSettingSchema.parse({
    ...userSetting,
    userId: session?.user.id,
  });
  try {
    await db.insert(userSettings).values(newUserSetting);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const updateUserSetting = async (
  userSetting: UpdateUserSettingParams
) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const newUserSetting = updateUserSettingSchema.parse({
    ...userSetting,
    userId: session?.user.id,
  });
  try {
    await db
      .update(userSettings)
      .set(newUserSetting)
      .where(eq(userSettings.userId, session?.user.id));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const upsertUserSetting = async (
  userSetting: UpdateUserSettingParams
) => {
  logger('upserting user settings');
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');
  const newUserSetting = updateUserSettingSchema.parse({
    ...userSetting,
    userId: session?.user.id,
  });
  try {
    // Check if userSetting exists
    const userSettingsCurrently = await getUserSettings();
    if (userSettingsCurrently.userSettings) {
      logger('has user settings already, so we update');
      updateUserSetting(newUserSetting);
    } else {
      logger('does not have user settings, so we create');
      createUserSetting(newUserSetting);
    }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};

export const deleteUserSetting = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) throw new Error('User not logged in');

  try {
    await db
      .delete(userSettings)
      .where(eq(userSettings.userId, session?.user.id));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    return { error: message };
  }
};
