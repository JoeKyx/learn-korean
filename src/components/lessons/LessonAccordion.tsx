'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { IoMdSchool } from 'react-icons/io';
import { IoLibrary } from 'react-icons/io5';

import { Language } from '@/lib/db/schema/languages';
import { PracticeLesson } from '@/lib/db/schema/lessons';
import { CategoryWithLesson } from '@/lib/types';

import ButtonLink from '@/components/links/ButtonLink';
import LessonProgress from '@/components/practice/LessonProgress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type LessonAccordionProps = {
  language: Language;
  filteredCategories: CategoryWithLesson[];
  practiceLessonsWithLatestAttempt: PracticeLesson;
};

export default function LessonAccordion({
  filteredCategories,
  language,
  practiceLessonsWithLatestAttempt,
}: LessonAccordionProps) {
  const MotionAccordionItem = motion(AccordionItem);

  return (
    <Accordion type='multiple'>
      {filteredCategories.map((category, i) => (
        <MotionAccordionItem
          value={category.name}
          key={category.id}
          className='relative  flex flex-col md:p-5 p-4 border border-black/40 rounded-lg mb-2 group shadow-lg'
          initial={{ opacity: 0, x: i % 2 == 0 ? -100 : 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2, duration: 0.5 }}
        >
          {/* Pseudo-element for background */}
          <div
            className='absolute inset-0 -z-10 opacity-30 group-hover:opacity-50 transition-all ease-in-out'
            style={{
              backgroundImage: `url(/images/lesson_categories/${category.image})`,
              backgroundPosition: 'top',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
          <div className='flex items-center justify-between'>
            <AccordionTrigger className='flex'>
              <h2 className='text-left'>{category.name}</h2>
            </AccordionTrigger>
            <ButtonLink
              href={`/dashboard/practice/language/${language.id}/${category.id}`}
              className='ml-auto h-10 group/button'
              rightIcon={IoLibrary}
              classNames={{
                rightIcon: 'group-hover/button:translate-x-1',
              }}
            >
              Practice All
            </ButtonLink>
          </div>
          <AccordionContent className='relative'>
            {category.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className='flex justify-between p-2 md:p-4 relative z-10 border-b border-black/40 last:border-b-0 hover:bg-white/10 rounded-lg'
              >
                <div className='flex w-1/2 flex-col'>
                  <h2>{lesson.name}</h2>
                  <p>{lesson.userId ? 'Private' : 'Public'} Lesson</p>
                  <p>Lesson {lesson.lessonNumber}</p>
                </div>
                <div className='flex w-1/2 justify-between'>
                  <LessonProgress
                    practiceWords={practiceLessonsWithLatestAttempt.words.filter(
                      (word) => word.lessonId == lesson.id
                    )}
                    className='md:block hidden'
                  />
                  <div className='flex gap-2 md:flex-row flex-col ml-auto'>
                    <ButtonLink
                      href={`/dashboard/edit/${lesson.id}`}
                      className='ml-auto h-10'
                      variant='secondary'
                      leftIcon={FiEdit}
                    >
                      Edit
                    </ButtonLink>
                    <ButtonLink
                      href={`/dashboard/practice/${lesson.id}`}
                      className='ml-auto h-10 group/button'
                      rightIcon={IoMdSchool}
                      classNames={{
                        rightIcon: 'group-hover/button:-translate-y-1',
                      }}
                    >
                      Practice
                    </ButtonLink>
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </MotionAccordionItem>
      ))}
    </Accordion>
  );
}
