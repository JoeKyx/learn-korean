import React from 'react'

import { getLanguages } from '@/lib/api/languages/queries';
import { getLessons, getLessonsWithCategory } from '@/lib/api/lessons/queries';
import { getUserSettings } from '@/lib/api/userSettings/queries';

import { SettingsProvider } from '@/components/context/settingsContext';
import { DashboardNavbar } from '@/components/navigation/DashboardNavbar';
import { getLessonCategories } from '@/lib/api/lessonCategories/queries';
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lessonsData = getLessonsWithCategory();

  const languagesData = getLanguages();

  const userSettingsData = getUserSettings();

  const [lessons, languages, userSettings] = await Promise.all([lessonsData, languagesData, userSettingsData]);

  return (
    <div className='w-screen h-screen'>

      <SettingsProvider availableLanguages={languages.languages} userSettings={userSettings.userSettings}>
        <DashboardNavbar lessons={lessons.categories} />
        {children}
      </SettingsProvider>
    </div>
  )
}
