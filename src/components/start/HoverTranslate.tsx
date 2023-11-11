'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LucideLightbulb, LucideLightbulbOff } from 'lucide-react';
import { CSSProperties, useRef, useState } from 'react';

import { koreanPhrases, WELCOME_TEXTS } from '@/lib/data';
import { cn } from '@/lib/utils';

import { useSectionInView } from '@/components/hooks';

import HandDrawnArrow from '/public/svg/arrow.svg';
import FlagKor from '/public/svg/flag_1.svg';
import FlagUK from '/public/svg/flag_uk.svg';

export default function HoverTranslate() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [toggle, setToggle] = useState(true); // State to track the toggle status

  const { ref } = useSectionInView('Top 10 Phrases');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleToggle = () => {
    setToggle(!toggle); // Toggle the language visibility
  };

  const flashlightBackground = toggle
    ? 'rgba(0, 0, 0, 0.7)'
    : 'rgba(255, 255, 255, 0.0)';
  const flashlightCircle = toggle
    ? 'rgba(255, 255, 255, 0.0)'
    : 'rgba(0, 0, 0, 0.7)';

  // The flashlight effect remains the same
  const flashlightStyle: CSSProperties = {
    background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, ${flashlightCircle} 100px, ${flashlightBackground} 100px)`,
    pointerEvents: 'none',
  };

  return (
    <section
      className='relative  h-screen w-full'
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursorPos({ x: -100, y: -100 })}
      style={{ cursor: 'none' }}
      id='top10'
      ref={ref}
    >
      {/* Button */}
      <div
        className='absolute top-0 md:left-0 right-0 md:right-[initial] m-4 z-[9] flex items-start'
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={handleToggle}
          className={cn(
            'p-2 rounded-full drop-shadow-lg',
            toggle
              ? 'bg-slate-200 text-slate-800'
              : 'bg-slate-800 text-slate-200'
          )}
        >
          <span>
            {toggle ? (
              <LucideLightbulbOff size={24} />
            ) : (
              <LucideLightbulb size={24} />
            )}
          </span>
        </button>
      </div>

      <div className='w-full h-full' style={{ position: 'relative' }}>
        <div className='w-full h-full absolute' style={flashlightStyle}></div>

        {/* Korean text */}
        <LanguageContent
          language='korean'
          cursorPos={cursorPos}
          toggle={toggle}
        />

        {/* English text */}
        <LanguageContent
          language='english'
          cursorPos={cursorPos}
          toggle={toggle}
        />
      </div>
    </section>
  );
}

type EntryProps = {
  korean: string;
  index: number;
  english: string;
  pronunciation: string;
  mode: 'korean' | 'english';
};

function Entry({ korean, english, pronunciation, mode, index }: EntryProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['0 1', '0 0.6'],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <motion.li
      className='flex flex-col gap-1 h-12'
      ref={ref}
      style={{ scale: scaleProgress, opacity: opacityProgress, originX: 0 }}
    >
      <span className='font-bold'>
        {index + 1}.{' '}
        {mode === 'korean' ? korean + ' - ' + pronunciation : english}
      </span>
    </motion.li>
  );
}

type LanguageContentProps = {
  language: 'korean' | 'english';
  cursorPos: { x: number; y: number };
  toggle: boolean;
};

function LanguageContent({
  language,
  cursorPos,
  toggle,
}: LanguageContentProps) {
  const isKorean = language === 'korean';

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['0 1', '0 0.6'],
  });

  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Depending on the toggle status, we switch the mask styles
  const getMaskStyle = (): CSSProperties => {
    const visible = `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, black 100px, transparent 100px)`;
    const invisible = `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, transparent 100px, black 100px)`;

    return {
      maskImage: toggle === isKorean ? visible : invisible,
      WebkitMaskImage: toggle === isKorean ? visible : invisible,
      maskMode: 'alpha',
      maskRepeat: 'no-repeat',
      maskPosition: '0% 0%',
      WebkitMaskPosition: '0% 0%',
    };
  };

  const phrases = isKorean
    ? koreanPhrases
    : koreanPhrases.map((p) => ({ ...p, korean: p.english }));
  const text = WELCOME_TEXTS[language];
  const Flag = isKorean ? FlagKor : FlagUK;

  return (
    <div
      className={cn(
        'absolute text-lg flex h-full w-full items-start justify-center   p-4',
        !isKorean ? 'text-slate-200' : 'text-slate-800'
      )}
      style={{ ...getMaskStyle() }}
    >
      <div className='absolute md:left-10 right-10 md:right-[initial]  z-10 flex md:items-start items-end'>
        <div className={cn('flex flex-col md:items-start items-end')}>
          <motion.div
            animate={{
              rotate: [0, 10, 0, -5, 0],
              transition: {
                repeat: Infinity,
                repeatDelay: 5,
                duration: 1,
              },
            }}
          >
            <HandDrawnArrow className='w-12 h-8 mr-2 mt-10 md:-scale-x-100' />
          </motion.div>
          <span className='font-handwritten'>{text.clickHere}</span>
        </div>
      </div>
      <div className='justify-start flex flex-col w-[50rem] pt-20'>
        <motion.div
          className='flex w-full'
          style={{ opacity: opacityProgress }}
        >
          <div>
            <h1 className='capitalize font-bold text-7xl mb-2' ref={ref}>
              {text.title}
            </h1>
            <h2 className='text-xl capitalize'>{text.subtitle}</h2>
          </div>
          <Flag
            className='w-[4.5rem] ml-auto'
            style={{ opacity: opacityProgress }}
          />
        </motion.div>
        <ol className='flex flex-col mt-4 text-sm'>
          {phrases.map((phrase, index) => (
            <Entry key={index} index={index} {...phrase} mode={language} />
          ))}
        </ol>
      </div>
    </div>
  );
}
