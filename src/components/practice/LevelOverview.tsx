import { FC, useEffect, useState } from "react";

import { PracticeWords } from "@/lib/db/schema/lessons";
import { calculateWordLevel } from "@/lib/lessonHelper";
import { useWordPractice } from "@/components/practice/WordPracticeContext";
import logger from "@/lib/logger";

type LevelOverviewProps = {};

const levelColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
];

const levelFilteredColors = [
  "bg-red-200",
  "bg-orange-200",
  "bg-yellow-200",
  "bg-blue-200",
  "bg-green-200",
];

const LevelOverview: FC<LevelOverviewProps> = () => {
  const [currentLevelProgress, setCurrentLevelProgress] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [currentLevelFilters, setCurrentLevelFilters] = useState<number[]>([]);

  const practiceContext = useWordPractice();

  const { allWords } = practiceContext.state;

  useEffect(() => {
    const levelProgress = [0, 0, 0, 0, 0];

    allWords.forEach((word) => {
      // Get userWord with max practicedAt
      const currentWordLevel = calculateWordLevel(word);
      levelProgress[currentWordLevel - 1] += 1;
    });

    setCurrentLevelProgress(levelProgress);
  }, [allWords]);

  const onLevelClickHandler = (level: number) => {
    logger(level, "Clicked Level")
    let tmpLevelFilters = currentLevelFilters;
    if (currentLevelFilters.includes(level)) {
      tmpLevelFilters = currentLevelFilters.filter(
        (currentLevel) => currentLevel !== level,
      );
    } else {
      tmpLevelFilters.push(level);
    }
    setCurrentLevelFilters(tmpLevelFilters);

    logger(tmpLevelFilters, "Applying Level Filters");
    practiceContext.dispatch({
      type: "SET_FILTERS",
      payload: {
        levels: tmpLevelFilters,
      },
    });
  };

  return (
    <div className="flex gap-2">
      {currentLevelProgress.map((level, index) => {
        return (
          <div
            key={index}
            className={`flex flex-col items-center ${currentLevelFilters.includes(index + 1)
              ? levelFilteredColors[index]
              : levelColors[index]
              } p-2 cursor-pointer`}
            onClick={() => onLevelClickHandler(index + 1)}
          >
            <span className="text-2xl">{level}</span>
            <span className="text-sm">Level {index + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LevelOverview;
