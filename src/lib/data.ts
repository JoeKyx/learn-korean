import Image from 'next/image';
import React from 'react';
import { GiProgression } from 'react-icons/gi';
import { IoMdBuild } from 'react-icons/io';
import { MdFilterList } from 'react-icons/md';

import {
  ChooseLanguage,
  ChooseLesson,
  SignUp,
} from '@/components/start/HowtoElements';
import {
  CustomContent,
  Filtering,
  KorAndJapanese,
  Progress,
} from '@/components/start/ReasonElements';

import lessonsImage from '/public/images/howto/lessons.jpeg';
import signUpImage from '/public/images/howto/signup.jpeg';
import JapanKorFlag from '/public/images/japankorflag.png';
export const koreanPhrases = [
  {
    english: 'Hello! How are you?',
    korean: '안녕하세요! 잘 지내세요?',
    pronunciation: 'Annyeonghaseyo! Jal jinaeseyo?',
  },
  {
    english: 'Thank you!',
    korean: '감사합니다!',
    pronunciation: 'Gamsahamnida!',
  },
  {
    english: 'Excuse me, where is the bathroom?',
    korean: '실례합니다, 화장실이 어디에 있나요?',
    pronunciation: 'Sillyehamnida, hwajangsili eodie innayo?',
  },
  {
    english: 'Can I have some water, please?',
    korean: '물 좀 주세요.',
    pronunciation: 'Mul jom juseyo.',
  },
  {
    english: 'How much is this?',
    korean: '이거 얼마예요?',
    pronunciation: 'Igeo eolmayeyo?',
  },
  {
    english: 'Can you give me a discount?',
    korean: '할인 해 주실 수 있나요?',
    pronunciation: 'Halin hae jusil su innayo?',
  },
  {
    english: "I'm lost.",
    korean: '길을 잃었어요.',
    pronunciation: 'Gireul ilheosseoyo.',
  },
  {
    english: "That's hilarious!",
    korean: '정말 웃겨요!',
    pronunciation: 'Jeongmal utgyeoyo!',
  },
  {
    english: 'Cheers!',
    korean: '건배!',
    pronunciation: 'Geonbae!',
  },
  {
    english: "I'm a spicy food warrior.",
    korean: '매운 음식 전사예요.',
    pronunciation: 'Maeun eumsik jeonsayeyo.',
  },
] as const;

export const WELCOME_TEXTS = {
  english: {
    title: 'Top 10 Phrases',
    subtitle: 'that you should know before going to Korea!',
    clickHere: 'Click here',
  },
  korean: {
    title: '상위 10개 문구',
    subtitle: '한국에 가기 전에 꼭 알아야 할 것',
    clickHere: '클릭',
  },
} as const;

export const HOME_LINKS = [
  {
    text: 'Home',
    hash: '#welcome',
  },
  {
    text: 'How to',
    hash: '#howto',
  },
  {
    text: 'Top 10 Phrases',
    hash: '#top10',
  },
  {
    text: 'Advantages',
    hash: '#reasons',
  },
] as const;

export const REASONS = [
  {
    name: 'Korean and Japanese',
    element: React.createElement(KorAndJapanese),
    icon: React.createElement(Image, {
      src: JapanKorFlag,
      alt: 'Fusion of Japanese and Korean flag',
      className:
        'w-[10rem] drop-shadow-sm object-scale-down text-gray-800 text-orange-400 transition duration-300 ease-in-out',
    }),
  },
  {
    name: 'See your progress',
    element: React.createElement(Progress),
    icon: React.createElement(GiProgression, {
      className: 'w-14 h-14  text-blue-400 transition duration-300 ease-in-out',
    }),
  },
  {
    name: 'Custom Content',
    element: React.createElement(CustomContent),
    icon: React.createElement(IoMdBuild, {
      className:
        'w-14 h-14  text-green-400  transition duration-300 ease-in-out',
    }),
  },
  {
    name: 'Filtering',
    element: React.createElement(Filtering),
    icon: React.createElement(MdFilterList, {
      className:
        'w-14 h-14  text-indigo-400  transition duration-300 ease-in-out',
    }),
  },
] as const;

export const HOWTO_STEPS = [
  {
    title: 'Sign up',
    text: React.createElement(SignUp),
    graphic: React.createElement(Image, {
      src: signUpImage,
      alt: 'Sign up',
      className: 'w-[15rem] drop-shadow-lg object-scale-down rounded-md',
    }),
  },
  {
    title: 'Choose a language',
    text: React.createElement(ChooseLanguage),
    graphic: React.createElement(Image, {
      src: JapanKorFlag,
      alt: 'Fusion of Japanese and Korean flag',
      className: 'w-[15rem] drop-shadow-lg object-scale-down',
    }),
  },
  {
    title: 'Choose your lesson',
    text: React.createElement(ChooseLesson),
    graphic: React.createElement(Image, {
      src: lessonsImage,
      alt: 'Lessons',
      className:
        'w-[15rem] drop-shadow-lg object-scale-down my-auto rounded-md',
    }),
  },
] as const;

type ACHIEVMENT_TYPES = 'card';

type ACHIEVEMENT_CHECKS = 'swipes';

export const ACHIEVMENTS = [
  {
    id: 1,
    type: 'card' as ACHIEVMENT_TYPES,
    check: 'swipes' as ACHIEVEMENT_CHECKS,
    goal: 10,
  },
];
