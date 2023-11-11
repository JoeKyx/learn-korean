'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { HOME_LINKS } from '@/lib/data';
import { cn } from '@/lib/utils';

import { useActiveSection } from '@/components/context/activeSectionContext';

export default function HomeNavbar() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSection();

  return (
    <header className='cursor-pointer'>
      <motion.div
        className='fixed top-0 left-1/2 h-[4.5rem] w-full rounded-none border border-white border-opacity-40
         bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] md:top-6 md:h-[3.25rem] 
         md:w-[36rem] md:rounded-full z-[10]'
        initial={{ y: -100, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
      ></motion.div>
      <nav className='flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 md:top-[1.7rem] md:h-[initial] md:py-0 z-[11]'>
        <ul className='flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 md:w-[initial] md:flex-nowrap md:gap-5'>
          {HOME_LINKS.map((link) => (
            <motion.li
              key={link.hash}
              className='h-3/4 flex items-center justify-center relative'
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                href={link.hash}
                className={cn(
                  'flex w-full items-center justify-center p-3 hover:text-gray-950 transition text-gray-500 dark:hover:text-gray-300'
                )}
                onClick={() => {
                  setTimeOfLastClick(Date.now());
                  setActiveSection(link.text);
                }}
              >
                {link.text}
                {activeSection === link.text && (
                  <motion.span
                    className='bg-gray-100 rounded-full absolute inset-0 -z-10'
                    layoutId='activeSection'
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  ></motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
