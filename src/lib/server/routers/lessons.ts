import { createLesson, deleteLesson,updateLesson } from "@/lib/api/lessons/mutations";
import { getLessonById, getLessons, getLessonsWithCategory } from "@/lib/api/lessons/queries";
import {
insertLessonParams,
  lessonIdSchema, updateLessonParams} from "@/lib/db/schema/lessons";

import { publicProcedure, router } from "../trpc";

export const lessonsRouter = router({
  getLessons: publicProcedure.query(async () => {
    return getLessons();
  }),
  getLessonById: publicProcedure.input(lessonIdSchema).query(async ({ input }) => {
    return getLessonById(input.id);
  }),
  updateLesson: publicProcedure
    .input(updateLessonParams)
    .mutation(async ({ input }) => {
      return updateLesson(input.id, input);
  }),
  createLesson: publicProcedure
    .input(insertLessonParams)
    .mutation(async ({ input }) => {
      return createLesson(input);
  }),
  deleteLesson: publicProcedure
    .input(lessonIdSchema)
    .mutation(async ({ input }) => {
      return deleteLesson(input.id);
  }),
  getLessonsWithCategory: publicProcedure
    .query(async () => {
      return getLessonsWithCategory();
  }),
});
