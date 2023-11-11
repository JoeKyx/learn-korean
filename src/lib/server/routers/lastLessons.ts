import {
  createLastLesson,
  deleteLastLesson,
  updateLastLesson,
} from '@/lib/api/lastLessons/mutations';
import {
  getLastLessonById,
  getLastLessons,
} from '@/lib/api/lastLessons/queries';
import {
  insertLastLessonParams,
  lastLessonIdSchema,
  updateLastLessonParams,
} from '@/lib/db/schema/lastLessons';

import { publicProcedure, router } from '../trpc';

export const lastLessonsRouter = router({
  getLastLessons: publicProcedure.query(async () => {
    return getLastLessons();
  }),
  getLastLessonById: publicProcedure
    .input(lastLessonIdSchema)
    .query(async ({ input }) => {
      return getLastLessonById(input.id);
    }),
  createLastLesson: publicProcedure
    .input(insertLastLessonParams)
    .mutation(async ({ input }) => {
      return createLastLesson(input);
    }),
  updateLastLesson: publicProcedure
    .input(updateLastLessonParams)
    .mutation(async ({ input }) => {
      return updateLastLesson(input.id, input);
    }),
  deleteLastLesson: publicProcedure
    .input(lastLessonIdSchema)
    .mutation(async ({ input }) => {
      return deleteLastLesson(input.id);
    }),
});
