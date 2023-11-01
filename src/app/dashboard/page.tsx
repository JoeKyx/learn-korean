
import { redirect } from "next/navigation";

import { getUserSettings } from "@/lib/api/userSettings/queries";

export default async function Dashboard() {

  const userSettings = await getUserSettings();

  const languageId = userSettings.userSettings.languageId ? userSettings.userSettings.languageId : 1;

  redirect('/dashboard/' + languageId + '/');


}