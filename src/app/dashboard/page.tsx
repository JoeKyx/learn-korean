
import { getUserSettings } from "@/lib/api/userSettings/queries";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Dashboard() {

  const userSettings = await getUserSettings();

  const languageId = userSettings.userSettings.languageId ? userSettings.userSettings.languageId : 1;

  redirect('/dashboard/' + languageId + '/');


}