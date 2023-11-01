import { getLanguageById, getLanguages } from "@/lib/api/languages/queries";
import {
  getLessonsWithCategory,
  getPracticeLessons
} from "@/lib/api/lessons/queries";
import logger from "@/lib/logger";

import AddNewLessonButton from "@/components/lessons/AddNewLessonButton";
import ButtonLink from "@/components/links/ButtonLink";
import LessonProgress from "@/components/practice/LessonProgress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const languagesRes = await getLanguages();



  return languagesRes.languages.map((language) => ({
    languageId: language.id.toString(),
  }))
}


export default async function Lessons({ params }: { params: { languageId: string } }) {
  const { languageId } = params;
  const languageIdNumber = parseInt(languageId, 10);
  const { categories } = await getLessonsWithCategory();
  const { language } = await getLanguageById(parseInt(languageId, 10));
  const practiceLessonsWithLatestAttempt = await getPracticeLessons(true, undefined, languageIdNumber);

  const filteredCategories = Object.values(categories).map(category => {
    logger(category.name, 'category name')
    return {
      ...category,
      lessons: category.lessons.filter(lesson => lesson.languageId == language.id)
    }
  }
  ).filter(category => category.lessons.length > 0)


  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 md:pt-5 sm:pt-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center">Available {language.language} Lessons</h1>
      <AddNewLessonButton className="my-2 ml-auto" />
      <div className="border border-primary-500 bg-primary-300 rounded-lg flex flex-col">
        <Accordion type="multiple" defaultValue={[...filteredCategories.map(category => category.name)]}>
          {filteredCategories.map((category) => (
            <AccordionItem value={category.name} key={category.id} className="relative z-10 flex flex-col md:p-5 p-4" >
              <div className="flex items-center">
                <AccordionTrigger className='flex-1'>
                  <h2>
                    {category.name}
                  </h2>
                </AccordionTrigger>
                <ButtonLink href={`/dashboard/practice/language/${language.id}/${category.id}`} className="ml-auto h-10">
                  Practice
                </ButtonLink>
              </div>
              <AccordionContent className="relative">
                {/* Pseudo-element for background */}
                <div className="absolute inset-0 z-0 rounded-lg border border-primary-500" style={{
                  backgroundImage: `url(/images/lesson_categories/${category.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.3,
                }}></div>
                {category.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex justify-between md:p-5 p-4 relative z-10 "

                  >
                    <div className="flex w-1/2 flex-col">
                      <h2>
                        {lesson.name}
                      </h2>
                      <p>{lesson.userId ? 'Private' : 'Public'} Lesson</p>
                      <p>Lesson {lesson.lessonNumber}</p>
                    </div>
                    <div className="flex w-1/2 justify-between">
                      <LessonProgress practiceWords={practiceLessonsWithLatestAttempt.lesson.words.filter(word => word.lessonId == lesson.id)} />
                      <div className="flex gap-2">

                        <ButtonLink
                          href={`/dashboard/edit/${lesson.id}`}
                          className="ml-auto h-10"
                        >
                          Edit
                        </ButtonLink>
                        <ButtonLink href={`/dashboard/practice/${lesson.id}`} className="ml-auto h-10">
                          Practice
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>

            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
