
import { Suspense } from "react";

import { getAllLessons, getLessonById, getLessons, getPracticeLessons } from "@/lib/api/lessons/queries";

import WordSwiper from "@/components/practice/WordSwiper";
import { getWordCategories } from "@/lib/api/wordCategories/queries";
import { WordPracticeProvider } from "@/components/practice/WordPracticeContext";

export async function generateStaticParams() {
  const lessonsRes = await getAllLessons();



  return lessonsRes.lessons.map((lesson) => ({
    lessonId: lesson.id.toString(),
  }))
}


export default async function Practice({ params }: { params: { lessonId: string } }) {
  const lessonIdNumber = parseInt(params.lessonId);



  return (
    <main className="flex flex-col items-center w-full h-screen justify-center gap-10">
      <Suspense fallback={<div>Loading...</div>}>
        <LessonName lessonIdNumber={lessonIdNumber} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <PracticeLesson lessonIdNumber={lessonIdNumber} />
      </Suspense>
    </main>
  )
}

async function LessonName({ lessonIdNumber }: { lessonIdNumber: number }) {
  const { lesson } = await getLessonById(lessonIdNumber);
  return <h1>{lesson.name} {lesson.languageId}</h1>
}

async function PracticeLesson({ lessonIdNumber }: { lessonIdNumber: number }) {
  const practiceLessonRes = getPracticeLessons(true, lessonIdNumber);
  const availableCategoriesRes = getWordCategories();

  const [practiceLessonData, availableCategoriesData] = await Promise.all([practiceLessonRes, availableCategoriesRes]);

  return (
    <WordPracticeProvider initialWords={practiceLessonData.lesson.words} availableCategories={availableCategoriesData.wordCategories}>
      <WordSwiper />
    </WordPracticeProvider>
  );
}