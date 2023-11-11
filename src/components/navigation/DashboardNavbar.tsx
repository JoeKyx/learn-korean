'use client';

import { useUser } from '@clerk/nextjs';
import { UserResource } from '@clerk/types';
import { AvatarFallback } from '@radix-ui/react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { LessonWithCategory } from '@/lib/db/schema/lessons';
import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import { useSettings } from '@/components/context/settingsContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export function DashboardNavbar({ lessons }: { lessons: LessonWithCategory }) {
  const {
    language: selectedLanguage,
    changeLanguage,
    availableLanguages,
  } = useSettings();

  const { push } = useRouter();

  const { user } = useUser();

  // Filter out lessons that are not for the selected language, if a category has no lessons for the selected language, remove the category
  const filteredLessons = Object.values(lessons)
    .map((category) => {
      return {
        ...category,
        lessons: category.lessons.filter(
          (lesson) => lesson.languageId == selectedLanguage.id
        ),
      };
    })
    .filter((category) => category.lessons.length > 0);

  const fallbackAvatarHandle = (user: UserResource) => {
    if (user.username) {
      return user.username.slice(0, 2);
    } else if (user.firstName) {
      return user.firstName.charAt(0);
    } else {
      return 'U';
    }
  };

  const username = user?.username || user?.firstName || 'User';

  return (
    <NavigationMenu className='z-[1] flex justify-center items-center  shadow-md p-2'>
      <NavigationMenuList className='flex items-center justify-between w-screen px-4'>
        <div className='flex items-center'>
          {availableLanguages.map((language) => (
            <NavigationMenuItem key={language.id}>
              <Button
                className='mx-2 group/lang hover:scale-105 transition-all'
                variant={
                  selectedLanguage.id === language.id ? 'primary' : 'outline'
                }
                onClick={() => {
                  changeLanguage(language);
                  push(`/dashboard/${language.id}`);
                }}
              >
                <div className='flex items-center justify-center gap-2'>
                  <span className='hidden md:block'>{language.language}</span>
                  <Image
                    src={`/svg/flag_${language.id}.svg`}
                    alt={language.language}
                    width={20}
                    height={20}
                    className='group-hover/lang:scale-125 transition-all'
                  />
                </div>
              </Button>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Vocabulary</NavigationMenuTrigger>
            <NavigationMenuContent className='bg-primary-200'>
              <ul className='grid gap-3 p-6 w-[300px] grid-cols-1 lg:w-[400px] lg:grid-cols-2'>
                <li className='lg:col-span-2'>
                  <NavigationMenuLink asChild>
                    <Link
                      className='flex p-2 select-none flex-col justify-end rounded-md bg-neutral-100 hover:bg-primary-100 transition-colors no-underline outline-none focus:shadow-md'
                      href={`/dashboard/lessons/${selectedLanguage.id}`}
                    >
                      <div className='mb-2 text-lg font-medium'>
                        Lesson Overview
                      </div>
                      <p className='text-sm leading-tight text-muted-foreground'>
                        Get an overview of the lessons available and your
                        progress
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>

                <Accordion type='single' collapsible>
                  {filteredLessons.map((category) => (
                    <AccordionItem value={category.name} key={category.id}>
                      <AccordionTrigger>{category.name}</AccordionTrigger>
                      <AccordionContent>
                        {category.lessons.map((lesson) => (
                          <ListItem
                            href={`/dashboard/practice/${lesson.id}/`}
                            key={lesson.id}
                            title={lesson.name}
                          >
                            Lesson - {lesson.lessonNumber}
                          </ListItem>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </div>
        <div className='flex items-center'>
          {user && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className='ml-auto flex items-center gap-4'>
                <span>
                  Hi <span className='font-semibold'>{username}</span>!
                </span>
                <Avatar>
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.username || 'Proile Picture of user'}
                  />
                  <AvatarFallback>{fallbackAvatarHandle(user)}</AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent className='bg-primary-200'>
                Test
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-neutral-800 hover:bg-primary-500 hover:text-neutral-950',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          {children ? (
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
              {children}
            </p>
          ) : null}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'DashboardNavbar';
