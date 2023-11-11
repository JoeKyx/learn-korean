'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { IoMdSchool } from 'react-icons/io';

import { AuthSession } from '@/lib/auth/utils';

import { useActiveSection } from '@/components/context/activeSectionContext';
import { useSectionInView } from '@/components/hooks';
import ButtonLink from '@/components/links/ButtonLink';

import logo from '/public/images/logo_1.png';

type WelcomeProps = {
  userAuth: AuthSession;
};

export default function Welcome({ userAuth }: WelcomeProps) {
  const { ref } = useSectionInView('Home');

  const { setTimeOfLastClick, setActiveSection } = useActiveSection();

  const handleLearnMoreClick = () => {
    setTimeOfLastClick(Date.now());
    setActiveSection('How to');
  };

  return (
    <section
      className='flex md:flex-row flex-col w-full items-center justify-center h-screen gap-4'
      id='welcome'
      ref={ref}
    >
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Image src={logo} alt='logo' className='w-[15rem]' />
      </motion.div>
      {/* Create a vertical divider line */}
      <motion.div
        className='md:border-l-2 border-l-black md:h-52 md:w-1 md:border-t-black hidden md:block'
        initial={{ scaleY: 0 }} // Start from scale 0
        animate={{ scaleY: 1 }} // Scale to 1
        transition={{ duration: 0.3, delay: 0.35 }}
        style={{ originY: 0 }}
      />
      <motion.div
        className=' border-l-black  h-1 w-52 border-l-0 border-t-2 border-t-black md:hidden'
        initial={{ scaleX: 0 }} // Start from scale 0
        animate={{ scaleX: 1 }} // Scale to 1
        transition={{ duration: 0.3, delay: 0.35 }}
        style={{ originX: 0 }}
      />
      <div className='flex flex-col gap-4'>
        <motion.h1
          className='text-4xl font-bold'
          initial={{ opacity: 0, y: -70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          안녕하세요
        </motion.h1>

        <div className='flex flex-col items-center w-full'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ButtonLink
              href='/dashboard'
              className='w-full hover:scale-110 active:scale-105 transition-all group'
              variant='primary'
            >
              {userAuth.session?.user.id ? (
                <span>Go to Dashboard</span>
              ) : (
                <span>Sign In</span>
              )}
              <IoMdSchool className='ml-2 group-hover:translate-x-1 group-hover:scale-105 transition-all' />
            </ButtonLink>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            or
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ButtonLink
              href='#howto'
              className='w-full hover:scale-105 transition-all active:scale-105 group'
              variant='light'
              onClick={handleLearnMoreClick}
            >
              Learn More
              <AiFillQuestionCircle className='ml-2 group-hover:scale-105 transition-all' />
            </ButtonLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
