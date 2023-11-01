'use client';
import { useEffect, useState } from 'react';

import { PracticeWords } from '@/lib/db/schema/lessons';
import { calculateLessonProgress } from '@/lib/lessonHelper';

import { useWordPractice } from '@/components/practice/WordPracticeContext';
import { Progress } from '@/components/ui/progress';

type LessonProgressProps = {
  practiceWords?: PracticeWords;
};

const LessonProgress: React.FC<LessonProgressProps> = ({ practiceWords }) => {
  const practiceContext = useWordPractice();

  const allWords = practiceWords || practiceContext.state.allWords;

  const [lessonProgress, setLessonProgress] = useState(
    calculateLessonProgress(allWords)
  );

  const showLevelSummary = false;

  useEffect(() => {
    setLessonProgress(calculateLessonProgress(allWords));
  }, [allWords]);

  const uniqueLevels = [1, 2, 3, 4, 5];

  // Skill level should be between 0 and 1 (0% and 100%)
  // maxPoints = amount of words * 5
  // Points = sum of levels
  // Skill level = Points / maxPoints
  const skillLevel = lessonProgress
    ? (lessonProgress.reduce((acc, word) => acc + word.level - 1, 0) /
        (lessonProgress.length * 4)) *
      100
    : 0;

  return (
    <div>
      {showLevelSummary &&
        uniqueLevels.map((level) => {
          return (
            <div key={level}>
              <h3>Level {level}</h3>
              <div className='flex flex-wrap'>
                {lessonProgress.filter((word) => word.level === level).length}
              </div>
            </div>
          );
        })}
      <div className='flex flex-col items-center'>
        <h3>Skill Level</h3>
        <Progress value={skillLevel} className='w-full' />
        <div className='flex'>
          <span className='ml-2'>
            {skillLevel ? skillLevel.toFixed(0) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LessonProgress;
