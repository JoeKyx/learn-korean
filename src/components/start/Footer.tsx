import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className='mb-10 px-4 text-center text-gray-500'>
      <small className='mb-2 text-xs block'>
        &copy; {new Date().getFullYear()}. All rights reserved.
      </small>
      <p className='text-xs'>
        <span className='font-semibold'>About Learn Korean:</span> built by{' '}
        <Link className='underline' href='https://joekyx.com' target='_blank'>
          Joe Kyx
        </Link>{' '}
        with React, Next.js, Tailwind CSS, and DrizzleORM.
      </p>
    </footer>
  );
}
