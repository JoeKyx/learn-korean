'use client';
import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Lesson } from '@/lib/db/schema/lessons';

import continueImg from '/public/images/dashboard/continue.jpeg';
import overviewImg from '/public/images/dashboard/overview.jpeg';

type ButtonAreaProps = {
  lastLesson?: Lesson | null;
  languageId: number;
};
export default function ButtonArea({
  lastLesson,
  languageId,
}: ButtonAreaProps) {
  return (
    <div className='flex md:flex-row flex-col gap-4 my-4'>
      {' '}
      {/* Set to desired width and height */}
      <DashboardButton
        text='Lesson Overview'
        link={`/dashboard/lessons/${languageId}`}
        image={overviewImg}
      />
      {lastLesson ? (
        <DashboardButton
          text='Continue last lesson'
          link={`/dashboard/practice/${lastLesson?.id}`}
          image={continueImg}
          subtitle={lastLesson.name}
          transitionDelay={0.5}
        />
      ) : null}
    </div>
  );
}

type DashboardButtonProps = {
  text: string;
  subtitle?: string;
  link: string;
  image: StaticImageData;
  transitionDelay?: number;
};

function DashboardButton({
  text,
  link,
  image,
  subtitle,
  transitionDelay,
}: DashboardButtonProps) {
  const MotionLink = motion(Link);

  return (
    <MotionLink
      href={link}
      className='relative w-full h-[10rem] overflow-hidden rounded-lg shadow-lg border-black/40 border group'
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: transitionDelay }}
    >
      <Image
        src={image}
        alt='Overview'
        layout='fill'
        objectFit='cover' // This will cover the entire container
        className='md:filter md:saturate-50 md:group-hover:saturate-100 transition-all ease-in-out group-hover:scale-110 group-active:scale-105' // This will add a filter (brightness) to the image
      />
      <p className='absolute bottom-0 right-0 m-4 text-slate-800 outline bg-white/80 font-semibold p-1 flex flex-col rounded-lg drop-shadow-md'>
        {' '}
        {/* Add your text styling here */}
        {text}
        {subtitle ? (
          <span className=' text-slate-800  font-semibold'>
            {' '}
            {/* Add your text styling here */}
            {subtitle}
          </span>
        ) : null}
      </p>
    </MotionLink>
  );
}
