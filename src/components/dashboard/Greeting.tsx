import { useSettings } from '@/components/context/settingsContext'
import { Language } from '@/lib/db/schema/languages';
import { trpc } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';
import React from 'react'

export default function Greeting({ className, language }: { className?: string, language: Language }) {



  return (
    <div className={cn('flex flex-col text-center', className)}>
      <h1>{language.greeting}!</h1>
      <h2>Time to learn some {language.language}?!</h2>
      {/* <p>You have already practiced {wordsPracticed} words!</p> */}

    </div>
  )
}
