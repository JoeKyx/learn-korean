import { getLanguageById, getLanguages } from '@/lib/api/languages/queries';
import {
  getLessonsWithCategory,
  getPracticeLessons,
} from '@/lib/api/lessons/queries';
import logger from '@/lib/logger';

import AddNewLessonButton from '@/components/lessons/AddNewLessonButton';
import LessonAccordion from '@/components/lessons/LessonAccordion';

// eslint-disable-next-line unused-imports/no-unused-vars
const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const languagesRes = await getLanguages();

  return languagesRes.languages.map((language) => ({
    languageId: language.id.toString(),
  }));
}

export default async function Lessons({
  params,
}: {
  params: { languageId: string };
}) {
  const { languageId } = params;
  const languageIdNumber = parseInt(languageId, 10);
  const { categories } = await getLessonsWithCategory();
  const { language } = await getLanguageById(parseInt(languageId, 10));
  const practiceLessonsWithLatestAttempt = await getPracticeLessons(
    true,
    undefined,
    languageIdNumber
  );

  const filteredCategories = Object.values(categories)
    .map((category) => {
      logger(category.name, 'category name');
      return {
        ...category,
        lessons: category.lessons.filter(
          (lesson) => lesson.languageId == language.id
        ),
      };
    })
    .filter((category) => category.lessons.length > 0);

  return (
    <main className='max-w-3xl mx-auto p-5 md:p-0 md:pt-5 sm:pt-4 flex flex-col'>
      <h1 className='text-3xl font-bold text-center'>
        Available {language.language} Lessons
      </h1>
      <AddNewLessonButton className='my-2 ml-auto' />
      <LessonAccordion
        filteredCategories={filteredCategories}
        language={language}
        practiceLessonsWithLatestAttempt={
          practiceLessonsWithLatestAttempt.lesson
        }
      />
    </main>
  );
}
