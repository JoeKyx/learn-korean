import AddNewLessonForm from "@/components/lessons/AddNewLessonForm";
import WordList from "@/components/words/wordList";
import { getAllLessons, getLessonById } from "@/lib/api/lessons/queries";
import { getWordsByLessonId } from "@/lib/api/words/queries";

export async function generateStaticParams() {
  const lessonsRes = await getAllLessons();



  return lessonsRes.lessons.map((lesson) => ({
    lessonId: lesson.id.toString(),
  }))
}


export default async function Edit({ params }: { params: { lessonId: string } }) {
  const { lessonId } = params;
  const lessonRq = getLessonById(parseInt(lessonId, 10));
  const wordsRq = getWordsByLessonId(parseInt(lessonId, 10));

  const [lessonRes, wordsRes] = await Promise.all([lessonRq, wordsRq]);



  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 md:pt-5 sm:pt-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center">Edit {lessonRes.lesson.name}</h1>
      <AddNewLessonForm lesson={lessonRes.lesson} languageId={lessonRes.lesson.languageId} />
      <WordList words={wordsRes.words} lessonId={lessonRes.lesson.id} />
    </main>
  );
}