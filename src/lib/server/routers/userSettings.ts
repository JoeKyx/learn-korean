import {
  createUserSetting,
  deleteUserSetting,
  updateUserSetting,
  upsertUserSetting,
} from '@/lib/api/userSettings/mutations';
import { getUserSettings } from '@/lib/api/userSettings/queries';
import {
  insertUserSettingParams,
  updateUserSettingParams,
} from '@/lib/db/schema/userSettings';

import { publicProcedure, router } from '../trpc';

export const userSettingsRouter = router({
  getUserSettings: publicProcedure.query(async () => {
    return getUserSettings();
  }),
  createUserSetting: publicProcedure
    .input(insertUserSettingParams)
    .mutation(async ({ input }) => {
      return createUserSetting(input);
    }),
  updateUserSetting: publicProcedure
    .input(updateUserSettingParams)
    .mutation(async ({ input }) => {
      return updateUserSetting(input);
    }),
  upsertUserSetting: publicProcedure
    .input(insertUserSettingParams)
    .mutation(async ({ input }) => {
      return upsertUserSetting(input);
    }),
  deleteUserSetting: publicProcedure.mutation(async () => {
    return deleteUserSetting();
  }),
});
