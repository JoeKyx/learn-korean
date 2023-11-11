import { getDatesStudiedByLanguage } from '@/lib/api/datesStudied/queries';
import { getLanguageById, getLanguages } from '@/lib/api/languages/queries';
import { getLastLessonByLanguageId } from '@/lib/api/lastLessons/queries';

import ButtonArea from '@/components/dashboard/ButtonArea';
import Calendar from '@/components/dashboard/Calendar';

export async function generateStaticParams() {
  const languagesRes = await getLanguages();

  return languagesRes.languages.map((language) => ({
    languageId: language.id.toString(),
  }));
}

export default async function Dashboard({
  params,
}: {
  params: { languageId: string };
}) {
  const languageIdNumber = parseInt(params.languageId);

  const languageRes = getLanguageById(languageIdNumber);
  const datesStudiedRes = getDatesStudiedByLanguage(languageIdNumber);
  const lastLessonRes = getLastLessonByLanguageId(languageIdNumber);

  const [languageData, datesStudiedData, lastLesson] = await Promise.all([
    languageRes,
    datesStudiedRes,
    lastLessonRes,
  ]);

  const _logoUrl = `/images/logo_${languageData.language.id}.png`;

  return (
    <main className='flex flex-col flex-wrap items-center justify-center mx-4 md:mx-0'>
      {/* <Image src={logoUrl} width={300} height={300} alt='Logo' /> */}
      {/* <Greeting className='text-4xl' language={languageData.language} />
      <PracticeLanguageLink
        className='mt-10'
        language={languageData.language}
      /> */}
      <h1 className='text-4xl mt-10'>
        Welcome {datesStudiedData.datesStudied.length > 0 ? 'Back!' : '!'}{' '}
      </h1>

      <div className='flex flex-col w-full md:w-1/2 sm:w-full'>
        <ButtonArea
          lastLesson={lastLesson.lastLesson}
          languageId={languageIdNumber}
        />
        <Calendar datesStudied={datesStudiedData.datesStudied} />
      </div>
    </main>
  );
}
