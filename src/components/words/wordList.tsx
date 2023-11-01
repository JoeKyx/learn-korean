import React from 'react'

import { LessonId } from '@/lib/db/schema/lessons';
import { Word } from '@/lib/db/schema/words'

import AddNewWordButton from '@/components/words/AddNewWordButton';

interface WordListProps {
  words: Word[]
  lessonId: LessonId
}
export default function WordList(props: WordListProps) {
  const { words, lessonId } = props;

  const Word = ({ word }: { word: Word }) => {
    return (
      <div
        className={`p-2 flex items-center justify-between w-full transition-colors duration-200 rounded-lg group
                ${word.userId ? 'hover:bg-primary-500 bg-primary-300  cursor-pointer' : 'bg-primary-200'}`}
        key={word.id}
      >
        <h2 className='text-left w-2/5'>{word.wordEng}</h2>

        {word.userId ? (
          <>
            <h2 className='text-center group-hover:hidden w-1/5'>-</h2>
            <p className='text-center hidden group-hover:block w-1/5'>Edit Word</p>
          </>
        ) : (
          <>
            <h2 className='text-center group-hover:hidden w-1/5'>-</h2>
            <p className='text-center hidden group-hover:block w-1/5'>Public Word</p>
          </>
        )}

        <h2 className='text-right w-2/5'>{word.wordKor}</h2>
      </div>
    )
  }

  const UserWord = ({ word }: { word: Word }) => {
    return (
      <AddNewWordButton word={word} lessonId={lessonId} customTrigger={<Word word={word} />} />
    )
  }

  return (
    <div className='mt-4'>
      <div className='flex flex-col gap-2'>
        {words.map((word) => (

          word.userId ? <UserWord word={word} /> :
            <Word word={word} />

        ))}
      </div>
      <AddNewWordButton lessonId={lessonId} className='mt-2' />
    </div>
  )
}
