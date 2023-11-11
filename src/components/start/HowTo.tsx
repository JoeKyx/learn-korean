'use client';
import { motion } from 'framer-motion';
import React from 'react';

import { HOWTO_STEPS } from '@/lib/data';

import { useSectionInView } from '@/components/hooks';

export default function HowTo() {
  const { ref } = useSectionInView('How to');

  return (
    <section
      ref={ref}
      className='md:h-screen items-center justify-start flex flex-col gap-2 scroll-mt-28'
      id='howto'
    >
      {HOWTO_STEPS.map((step, i) => (
        <motion.div
          key={step.title}
          className='flex w-4/5 border-b border-black/50 p-4 gap-2 last:border-b-0 justify-center items-center'
          initial={{ opacity: 0, x: i % 2 == 0 ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-20%' }}
        >
          <div className='mr-5 hidden md:block'>
            <h1 className='text-6xl font-bold'>{i + 1}</h1>
          </div>
          <div className='w-3/4'>
            <h2 className='text-3xl font-semibold mb-2'>{step.title}</h2>
            {step.text}
          </div>
          <div className='ml-auto justify-center h-full'>{step.graphic}</div>
        </motion.div>
      ))}
    </section>
  );
}
