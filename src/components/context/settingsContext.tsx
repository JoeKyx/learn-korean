'use client';
import React, { createContext, ReactNode, useContext, useState } from 'react';

import { Language } from '@/lib/db/schema/languages';
import { LessonId } from '@/lib/db/schema/lessons';
import { UserSetting } from '@/lib/db/schema/userSettings';
import { trpc } from '@/lib/trpc/client';

interface SettingsContextProps {
  language: Language;
  changeLanguage: (language: Language) => void;
  availableLanguages: Language[];
  userId: string;
  soundsEnabled: boolean;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  availableLanguages: Language[];
  userSettings: UserSetting;
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  availableLanguages,
  userSettings,
}) => {
  const defaultLanguage = userSettings?.languageId
    ? availableLanguages.find(
        (language) => language.id === userSettings.languageId
      )
    : availableLanguages[0];

  if (!defaultLanguage) {
    throw new Error('No matching language found');
  }

  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [soundsEnabled, _setSoundsEnabled] = useState<boolean>(true);

  const { mutate: upsertSettings } =
    trpc.userSettings.upsertUserSetting.useMutation({});

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    upsertSettings({
      languageId: newLanguage.id,
    });
  };

  const _updateLastLessonId = (_lessonId: LessonId) => {
    upsertSettings({
      languageId: userSettings?.languageId,
    });
  };

  const userId = userSettings?.userId;

  return (
    <SettingsContext.Provider
      value={{
        language,
        changeLanguage,
        availableLanguages,
        userId,
        soundsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
