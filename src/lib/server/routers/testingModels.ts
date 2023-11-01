import {
  createTestingModel,
  deleteTestingModel,
  updateTestingModel,
} from '@/lib/api/testingModels/mutations';
import {
  getTestingModelById,
  getTestingModels,
} from '@/lib/api/testingModels/queries';
import {
  insertTestingModelParams,
  testingModelIdSchema,
  updateTestingModelParams,
} from '@/lib/db/schema/testingModels';

import { publicProcedure, router } from '../trpc';

export const testingModelsRouter = router({
  getTestingModels: publicProcedure.query(async () => {
    return getTestingModels();
  }),
  getTestingModelById: publicProcedure
    .input(testingModelIdSchema)
    .query(async ({ input }) => {
      return getTestingModelById(input.id);
    }),
  createTestingModel: publicProcedure
    .input(insertTestingModelParams)
    .mutation(async ({ input }) => {
      return createTestingModel(input);
    }),
  updateTestingModel: publicProcedure
    .input(updateTestingModelParams)
    .mutation(async ({ input }) => {
      return updateTestingModel(input.id, input);
    }),
  deleteTestingModel: publicProcedure
    .input(testingModelIdSchema)
    .mutation(async ({ input }) => {
      return deleteTestingModel(input.id);
    }),
});
