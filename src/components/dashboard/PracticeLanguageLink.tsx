import React from 'react'

import { Language } from '@/lib/db/schema/languages'
import { cn } from '@/lib/utils'

import ButtonLink from '@/components/links/ButtonLink'

export default function PracticeLanguageLink({ className, language }: { className?: string, language: Language }) {

  return (
    <ButtonLink href={`/dashboard/practice/language/${language.id}`} className={cn(className)}>
      Practice now
    </ButtonLink>
  )
}
