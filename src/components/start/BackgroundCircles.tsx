'use client';
import { motion } from 'framer-motion';

const BackgroundCircles = () => {
  return (
    <>
      <motion.div
        className='bg-[#bcd3f0] absolute top-[-6rem] -z-10 right-[11rem] h-[40.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem]'
        animate={{
          backgroundColor: ['#bcd3f0', '#a8bde0', '#bcd3f0'], // Array of colors for animation
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      ></motion.div>

      <motion.div
        className='bg-[#fff0f1] absolute top-[-1rem] -z-10 left-[-35rem] h-[40.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]'
        animate={{
          backgroundColor: ['#fff0f1', '#ffe0e1', '#fff0f1'], // Array of colors for animation
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      ></motion.div>
    </>
  );
};

export default BackgroundCircles;
