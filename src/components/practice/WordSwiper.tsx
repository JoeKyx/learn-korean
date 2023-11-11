'use client';
import { useAuth } from '@clerk/nextjs';
import { QuestionMarkIcon } from '@radix-ui/react-icons';
import { Banana, Bird, Fish, Heart, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

import { WordCategorie, WordCategorieId } from '@/lib/db/schema/wordCategories';
import { calculateWordLevel } from '@/lib/lessonHelper';
import logger from '@/lib/logger';
import { trpc } from '@/lib/trpc/client';
import { handleError } from '@/lib/utils';

import AchievementToastDescription from '@/components/achievements/AchievementToast';
import Button from '@/components/buttons/Button';
import CategoryOverview from '@/components/practice/CategoryOverview';
import LessonProgress from '@/components/practice/LessonProgress';
import LevelOverview from '@/components/practice/LevelOverview';
import { ModeType } from '@/components/practice/WordPracticeContext';
import { useWordPractice } from '@/components/practice/WordPracticeContext';
import { toast } from '@/components/ui/use-toast';

export type IconType = {
  name: string;
  icon: LucideIcon;
};

export const icons: IconType[] = [
  {
    name: 'Heart',
    icon: Heart,
  },
  {
    name: 'Fish',
    icon: Fish,
  },
  {
    name: 'Banana',
    icon: Banana,
  },
  {
    name: 'Zap',
    icon: Zap,
  },
  {
    name: 'Bird',
    icon: Bird,
  },
];

export default function WordSwiper() {
  const { userId } = useAuth();

  const [status, _setStatus] = useState('');
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const [swipeThreshold, setSwipeThreshold] = useState(100); // Default to 100

  const [wasCorrectSwipe, setWasCorrectSwipe] = useState(false);
  const [wasIncorrectSwipe, setWasIncorrectSwipe] = useState(false);

  const [successSound, setSuccessSound] = useState<HTMLAudioElement | null>(
    null
  );

  const animationLength = 500;

  useEffect(() => {
    const audio = new Audio('/sounds/success.mp3');
    audio.volume = 0.5;
    setSuccessSound(audio);
  }, []);

  useEffect(() => {
    if (wasCorrectSwipe) {
      const timeout = setTimeout(() => {
        setWasCorrectSwipe(false);
      }, animationLength);

      return () => clearTimeout(timeout);
    }
  }, [wasCorrectSwipe]);

  useEffect(() => {
    if (wasIncorrectSwipe) {
      const timeout = setTimeout(() => {
        setWasIncorrectSwipe(false);
      }, animationLength);

      return () => clearTimeout(timeout);
    }
  }, [wasIncorrectSwipe]);

  useEffect(() => {
    // Function to update the swipe threshold based on screen width
    const updateThreshold = () => {
      if (window.innerWidth <= 768) {
        // 768px is typical breakpoint for mobile
        setSwipeThreshold(70);
      } else {
        setSwipeThreshold(100);
      }
    };

    // Update threshold on initial load
    updateThreshold();

    // Listen for window resize and update threshold accordingly
    window.addEventListener('resize', updateThreshold);

    // Cleanup the listener when the component unmounts
    return () => window.removeEventListener('resize', updateThreshold);
  }, []);

  const practiceContext = useWordPractice();

  const { currentWord, mode, wordCategories, noWords } = practiceContext.state;

  const { mutate: createUserWord, error } =
    trpc.userWords.createUserWord.useMutation({
      onError: handleError,
      onSuccess: (data) => {
        if (data.success) {
          data.achievments.forEach((achievment) => {
            toast({
              title: 'Unlocked Achievment',
              description: (
                <AchievementToastDescription achievment={achievment} />
              ),
              variant: 'default',
            });
          });
        }
      },
    });

  const handleSwipe = (success: boolean, wasSwipe: boolean) => {
    let newLevel = currentWord
      ? calculateWordLevel(currentWord) + (success ? 1 : -1)
      : 1;
    if (newLevel < 1) {
      newLevel = 1;
    }
    if (newLevel > 5) {
      newLevel = 5;
    }
    if (success) {
      if (successSound) {
        successSound.play().catch((error) => {
          handleError(error);
        });
      }
      // We check if the user swiped or clicked the button
      // If the user clicked the button we want to show the animation
      if (!wasSwipe) {
        setWasCorrectSwipe(true);
      }
    } else {
      if (!wasSwipe) {
        setWasIncorrectSwipe(true);
        setWasCorrectSwipe(false);
      }
    }
    if (currentWord) {
      createUserWord({
        attemptedAt: new Date(),
        success,
        level: newLevel,
        wordId: currentWord.id,
      });
      // Wait until the animation is finished before updating the word
      setTimeout(() => {
        practiceContext.dispatch({
          type: 'SWIPE_WORD',
          payload: { success, userId: userId || '' },
        });
      }, animationLength);
    }
  };

  const { mutate: deleteWordUserCategoryByCategoryId } =
    trpc.wordUserCategories.deleteWordUserCategoryByCategoryId.useMutation({});

  const { mutate: createWordUserCategory } =
    trpc.wordUserCategories.createWordUserCategorie.useMutation({});

  const handleCategoryClick = (categoryId: WordCategorieId) => {
    logger(categoryId, 'Clicked Category');
    if (
      currentWord?.categories.some(
        (currentCategory) => currentCategory.wordcategorieId === categoryId
      )
    ) {
      logger(categoryId, 'Removing Category from Word');
      practiceContext.dispatch({
        type: 'REMOVE_CATEGORY_FROM_WORD',
        payload: {
          categoryId: categoryId,
          wordId: currentWord.id,
        },
      });
      deleteWordUserCategoryByCategoryId({
        wordcategorieId: categoryId,
        wordId: currentWord.id,
      });
    } else if (currentWord) {
      logger(categoryId, 'Adding Category to Word');
      practiceContext.dispatch({
        type: 'ADD_CATEGORY_TO_WORD',
        payload: {
          categoryId: categoryId,
          userId: userId || '',
          wordId: currentWord.id,
        },
      });
      createWordUserCategory({
        addedAt: new Date(),
        wordId: currentWord.id,
        wordcategorieId: categoryId,
      });
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (swipeDelta <= -swipeThreshold) {
        handleSwipe(false, true);
      }
      setIsSwiping(false);
      setSwipeDelta(0);
    },
    onSwipedRight: () => {
      if (swipeDelta >= swipeThreshold) {
        handleSwipe(true, true);
      }
      setIsSwiping(false);
      setSwipeDelta(0);
    },
    trackMouse: true,
    onSwiping: (event) => {
      setIsSwiping(true);
      setSwipeDelta(event.deltaX);
    },
    onSwiped: () => {
      setIsSwiping(false);
      setSwipeDelta(0);
    },
  });

  const cardStyle = {
    transform: isSwiping ? `translateX(${swipeDelta}px)` : undefined,
    transition: isSwiping ? 'none' : 'transform 0.3s ease',
  };

  const CategoryIcon = ({
    category,
    isSelected,
  }: {
    category: WordCategorie;
    isSelected: boolean;
  }) => {
    const IconComponent =
      icons.find((icon) => icon.name === category.name)?.icon ||
      QuestionMarkIcon;

    return (
      <IconComponent
        key={category.id}
        className='text-neutral-700 hover:fill-neutral-200 fill-blue-500'
        style={isSelected ? { fill: category.color } : {}}
        size={24}
        onClick={() => handleCategoryClick(category.id)}
      />
    );
  };

  return (
    <div className='flex flex-col items-center justify-center gap-5'>
      <CategoryOverview />
      <LevelOverview />
      <LessonProgress />
      {error ? <span>{error.message}</span> : null}

      <div
        className={`my-auto w-full h-52 flex flex-col items-center rounded-md shadow-md 
    ${wasCorrectSwipe ? 'card-correct-swipe' : ''}
    ${wasIncorrectSwipe ? 'card-incorrect-swipe' : ''}
    ${
      swipeDelta >= swipeThreshold
        ? 'bg-green-500 bg-opacity-50'
        : swipeDelta <= -swipeThreshold
        ? 'bg-red-500 bg-opacity-50'
        : 'bg-yellow-300'
    }`}
        {...swipeHandlers}
        style={cardStyle}
      >
        {noWords ? (
          <span>No words with selected filters</span>
        ) : (
          <>
            <div className='flex justify-between w-full p-2'>
              <div className='flex gap-4'>
                {wordCategories.map((category) => {
                  return (
                    <CategoryIcon
                      category={category}
                      isSelected={
                        currentWord?.categories.some(
                          (wordCat) => wordCat.wordcategorieId === category.id
                        ) || false
                      }
                      key={category.id}
                    />
                  );
                })}
              </div>
              <span className='ml-auto'>
                {currentWord ? calculateWordLevel(currentWord) : 1} -{' '}
                {mode === 'english' ? 'English' : 'Foreign'}
              </span>
            </div>

            <div className='pt-14'>
              <span
                className={`${
                  currentWord?.wordEng.length || (0 > 10 && mode === 'english')
                    ? 'text-xl'
                    : 'text-3xl'
                } font-bold justify-self-center cursor-pointer`}
                onClick={() => {
                  let newMode: ModeType;
                  if (mode === 'english') {
                    newMode = 'foreign';
                  } else {
                    newMode = 'english';
                  }
                  practiceContext.dispatch({
                    type: 'SET_MODE',
                    payload: { mode: newMode },
                  });
                }}
              >
                {currentWord?.wordEng && currentWord?.wordKor
                  ? mode === 'english'
                    ? currentWord.wordDe || currentWord.wordEng
                    : currentWord.wordKor
                  : 'Something went wrong'}
              </span>
              {currentWord?.wordEng !== currentWord?.pronunciation &&
              mode === 'english' ? (
                <span> ({currentWord?.pronunciation})</span>
              ) : null}
            </div>
            <div className='flex w-full gap-4 mt-auto justify-between'>
              <Button
                variant='ghost'
                className='text-red-500'
                onClick={() => handleSwipe(false, false)}
              >
                Incorrect
              </Button>
              <Button
                variant='ghost'
                className='text-green-500'
                onClick={() => handleSwipe(true, false)}
              >
                Correct
              </Button>
            </div>
            <div>{status}</div>

            <Button
              variant='light'
              className='w-full items-center justify-center text-center flex'
              onClick={() =>
                practiceContext.dispatch({ type: 'SHUFFLE_WORDS' })
              }
            >
              Shuffle Cards
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
