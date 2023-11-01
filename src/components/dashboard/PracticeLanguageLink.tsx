import { useSettings } from '@/components/context/settingsContext'
import ButtonLink from '@/components/links/ButtonLink'
import { Language } from '@/lib/db/schema/languages'
import { cn } from '@/lib/utils'
import React from 'react'

export default function PracticeLanguageLink({ className, language }: { className?: string, language: Language }) {

  return (
    <ButtonLink href={`/dashboard/practice/language/${language.id}`} className={cn(className)}>
      Practice now
    </ButtonLink>
  )
}
