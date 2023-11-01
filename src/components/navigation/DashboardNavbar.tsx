"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { LessonWithCategory } from "@/lib/db/schema/lessons"
import { cn } from "@/lib/utils"

import Button from "@/components/buttons/Button"
import { useSettings } from "@/components/context/settingsContext"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export function DashboardNavbar({ lessons }: { lessons: LessonWithCategory }) {

  const { language: selectedLanguage, changeLanguage, availableLanguages } = useSettings()

  const { push } = useRouter()



  // Filter out lessons that are not for the selected language, if a category has no lessons for the selected language, remove the category
  const filteredLessons = Object.values(lessons).map(category => {
    return {
      ...category,
      lessons: category.lessons.filter(lesson => lesson.languageId == selectedLanguage.id)
    }
  }
  ).filter(category => category.lessons.length > 0)


  return (
    <NavigationMenu className="z-[1] flex w-screen justify-center items-center bg-primary-200 shadow-md p-2 px-4">
      <NavigationMenuList className="flex items-center justify-center md:justify-start w-screen">
        <NavigationMenuItem>
          {availableLanguages.map((language) => (
            <Button key={language.id} className='mx-2' variant={selectedLanguage.id === language.id ? 'primary' : 'outline'}
              onClick={() => {
                changeLanguage(language)
                push(`/dashboard/${language.id}`)
              }
              }
            >
              <div className="flex items-center justify-center gap-2">
                <span className="hidden md:block">
                  {language.language}
                </span>
                <Image src={`/svg/flag_${language.id}.svg`} alt={language.language} width={20} height={20} />
              </div>
            </Button>
          ))}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Vocabulary</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-primary-200">
            <ul className="grid gap-3 p-6 w-[300px] grid-cols-1 lg:w-[400px] lg:grid-cols-2">
              <li className="lg:col-span-2">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex p-2 select-none flex-col justify-end rounded-md bg-neutral-100 hover:bg-primary-100 transition-colors no-underline outline-none focus:shadow-md"
                    href={`/dashboard/lessons/${selectedLanguage.id}`}>
                    <div className="mb-2 text-lg font-medium">
                      Lesson Overview
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Get an overview of the lessons available and your progress
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <div>
                <Accordion type="single" collapsible>
                  {filteredLessons.map(category => (
                    <AccordionItem value={category.name} key={category.id}>
                      <AccordionTrigger>{category.name}</AccordionTrigger>
                      <AccordionContent>
                        {category.lessons.map(lesson => (
                          <ListItem href={`/dashboard/practice/${lesson.id}/`} key={lesson.id} title={lesson.name}>
                            Lesson - {lesson.lessonNumber}
                          </ListItem>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}

                </Accordion>

              </div>
            </ul>
          </NavigationMenuContent>

        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu >
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-neutral-800 hover:bg-primary-500 hover:text-neutral-950",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children ? (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          ) : null}
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "DashboardNavbar"
