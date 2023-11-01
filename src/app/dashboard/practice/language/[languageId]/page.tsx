
import { Suspense } from "react";

import { getAllLessons, getLessonById, getLessons, getPracticeLessons } from "@/lib/api/lessons/queries";

import WordSwiper from "@/components/practice/WordSwiper";
import { getWordCategories } from "@/lib/api/wordCategories/queries";
import { WordPracticeProvider } from "@/components/practice/WordPracticeContext";
import { getLanguages } from "@/lib/api/languages/queries";

export async function generateStaticParams() {
  const languagesRes = await getLanguages();



  return languagesRes.languages.map((language) => ({
    languageId: language.id.toString(),
  }))
}


export default async function Practice({ params }: { params: { languageId: string } }) {

  const languageIdNumber = parseInt(params.languageId);

  const practiceLessonRes = getPracticeLessons(true, undefined, languageIdNumber, true);

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