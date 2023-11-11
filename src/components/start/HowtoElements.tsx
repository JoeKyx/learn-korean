'use client';
import { IoMdCreate } from 'react-icons/io';

import ButtonLink from '@/components/links/ButtonLink';

export function SignUp() {
  return (
    <div className='flex flex-col gap-2'>
      <span>
        Sign up to start learning. This will allow you to{' '}
        <span className='italic'>
          save your progress and customize your learning experience
        </span>
        .
      </span>
      <ButtonLink
        href='/dashboard'
        className='mr-auto hover:scale-105 active:scale-105 transition-all group'
        variant='primary'
      >
        <span>Sign up here</span>
        <IoMdCreate className='ml-2 group-hover:translate-y-1 group-hover:-translate-x-1 transition-all' />
      </ButtonLink>
    </div>
  );
}

export function ChooseLanguage() {
  return (
    <span>
      Yes, our name is Learn Korean, but we we also{' '}
      <span className='font-bold'>offer Japanese</span>. And no worries, you can
      switch between the two languages at any time.
    </span>
  );
}

export function ChooseLesson() {
  return (
    <span>
      Already know the basics? No problem, you can{' '}
      <span className='italic'>
        choose any lesson you want and start learning right away
      </span>
      . We are constantly adding new lessons. If there is a specific topic that
      we are missing, you also have the option to{' '}
      <span className='font-bold'>add your own lessons</span>.
    </span>
  );
}
