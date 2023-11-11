'use client';

import { useUser } from '@clerk/nextjs';
import { UserResource } from '@clerk/types';
import { motion } from 'framer-motion';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function NavigationMenuDemo() {
  const { user } = useUser();
  const fallbackAvatarHandle = (user: UserResource | null | undefined) => {
    if (user?.username) {
      return user.username.slice(0, 2);
    } else if (user?.firstName) {
      return user.firstName.charAt(0);
    } else {
      return 'U';
    }
  };

  const username = user?.username || user?.firstName || 'User';

  return (
    <header className='cursor-pointer'>
      <motion.div
        className='fixed top-0 left-1/2 h-[4.5rem] w-full rounded-none border border-white border-opacity-40
       bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] md:top-6 md:h-[3.25rem] 
       md:w-1/2 md:rounded-full z-[10]'
        initial={{ y: -100, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
      ></motion.div>
      <nav className='flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 md:top-[1.7rem] md:h-[initial] md:py-0 z-[11]'>
        <ul className='flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 md:w-[initial] md:flex-nowrap md:gap-5'>
          <li className='h-3/4 flex items-center justify-center relative gap-2'>
            <span>
              Hi <span className='font-semibold'>{username}</span>!
            </span>
            <Avatar>
              <AvatarImage
                src={user?.imageUrl}
                alt={username || 'Proile Picture of user'}
              />
              <AvatarFallback>{fallbackAvatarHandle(user)}</AvatarFallback>
            </Avatar>
          </li>
          <li>
            <span>Today I want to learn:</span>
          </li>
        </ul>
      </nav>
    </header>
  );
}
