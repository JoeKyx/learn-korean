'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

import { REASONS } from '@/lib/data';
import { ReasonType } from '@/lib/types';

import { useSectionInView } from '@/components/hooks';
export default function Reasons() {
  const { ref } = useSectionInView('Advantages');

  return (
    <section
      className='md:h-screen w-full items-center justify-center flex flex-col pt-14 pb-10'
      id='reasons'
      ref={ref}
    >
      <motion.h1
        className='capitalize'
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Why you will love learning with us
      </motion.h1>
      <div className='flex flex-col items-center justify-center mb-8 mt-4'>
        {REASONS.map((reason) => (
          <Reason key={reason.name} reason={reason} />
        ))}
      </div>
      <motion.h3
        className='capitalize'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        And the best?
      </motion.h3>
      <motion.h2
        className='capitalize'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        It is completely free
      </motion.h2>
      <motion.div
        className='h-1 md:w-72 w-52 border-l-0 border-t-2 border-t-black'
        initial={{ scaleX: 0 }} // Start from scale 0
        whileInView={{ scaleX: 1 }} // Scale to 1
        transition={{ duration: 0.5, delay: 1.5 }}
        style={{ originX: 0 }}
        viewport={{ once: true }}
      />
      <motion.button
        className='bg-blue-400 text-white px-4 py-2 rounded-md mt-4 hover:scale-110 hover:bg-indigo-600 active:scale-105 transition-all flex items-center gap-2 group'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        viewport={{ once: true }}
      >
        Start Learning Now{' '}
        <span className='group-hover:translate-x-1 transition-all'>가다</span>{' '}
      </motion.button>
    </section>
  );
}

function Reason({ reason }: { reason: ReasonType }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['0 1', '0 0.6'],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  const iconVariants = {
    rest: { scale: 1, ease: 'easeOut', duration: 0.2, type: 'tween' },
    hover: {
      scale: 1.2,
      transition: {
        duration: 0.4,
        type: 'tween',
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      initial='rest'
      className='flex odd:flex-row-reverse md:w-1/2 items-center gap-5 border-b p-4 border-black first:border-t-0 hover:bg-white/20 transition-all duration-300 ease-in-out'
      ref={ref}
      style={{ opacity: opacityProgress, scale: scaleProgress }}
      whileHover='hover'
    >
      <motion.div variants={iconVariants}>{reason.icon}</motion.div>
      <div>{reason.element}</div>
    </motion.div>
  );
}
