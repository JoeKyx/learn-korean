
import { Suspense } from "react";

import { getAllLessonCategoryLanguageCombinations } from "@/lib/api/lessonCategories/queries";
import { getPracticeLessonByCategory } from "@/lib/api/lessons/queries";
import { getWordCategories } from "@/lib/api/wordCategories/queries";
import logger from "@/lib/logger";

import { WordPracticeProvider } from "@/components/practice/WordPracticeContext";
import WordSwiper from "@/components/practice/WordSwiper";

export async function generateStaticParams() {
  const categoryLanguagesRes = await getAllLessonCategoryLanguageCombinations();

  logger(categoryLanguagesRes, 'Generating static params for practice page')

  return categoryLanguagesRes.map((categoryLanguage) => ({
    languageId: categoryLanguage.languageId.toString(),
    categoryId: categoryLanguage.categoryId.toString()
  }))
}


export default async function Practice({ params }: { params: { languageId: string, categoryId: string } }) {

  const languageIdNumber = parseInt(params.languageId);
  const categoryIdNumber = parseInt(params.categoryId);

  const practiceLessonRes = getPracticeLessonByCategory(languageIdNumber, categoryIdNumber);

  const availableCategoriesRes = getWordCategories();

  const [practiceLessonData, availableCategoriesData] = await Promise.all([practiceLessonRes, availableCategoriesRes]);


  return (
    <main className="flex flex-col items-center w-full h-screen justify-center gap-10">
      <h1>Practice</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <WordPracticeProvider initialWords={practiceLessonData.lesson.words} availableCategories={availableCategoriesData.wordCategories}>
          <WordSwiper />
        </WordPracticeProvider>
      </Suspense>
    </main>
  )
}