import Greeting from "@/components/dashboard/Greeting";
import PracticeLanguageLink from "@/components/dashboard/PracticeLanguageLink";
import { getLanguageById, getLanguages } from "@/lib/api/languages/queries";
import Calendar from "@/components/dashboard/Calendar";
import { getDatesStudiedByLanguage } from "@/lib/api/datesStudied/queries";
import Image from "next/image";

export async function generateStaticParams() {
  const languagesRes = await getLanguages();



  return languagesRes.languages.map((language) => ({
    languageId: language.id.toString(),
  }))
}



export default async function Dashboard({ params }: { params: { languageId: string } }) {

  const languageIdNumber = parseInt(params.languageId);

  const languageRes = getLanguageById(languageIdNumber);
  const datesStudiedRes = getDatesStudiedByLanguage(languageIdNumber);

  const [languageData, datesStudiedData] = await Promise.all([languageRes, datesStudiedRes]);

  const logoUrl = `/images/logo_${languageData.language.id}.png`

  return (
    <main className="flex flex-col items-center justify-center h-full">
      <Image src={logoUrl} width={300} height={300} alt={'Logo'} />
      <Greeting className="text-4xl" language={languageData.language} />
      <PracticeLanguageLink className="mt-10" language={languageData.language} />
      <Calendar className="mt-10" datesStudied={datesStudiedData.datesStudied} />
    </main>
  );
}