import { PracticeWord, PracticeWords } from "@/lib/db/schema/lessons";

export type LessonProgress = {
  
    wordId: number;
    attempts: number;
    level: number;
  
};

export function  calculateLessonProgress(practiceWordsArray: PracticeWords): LessonProgress[] {
  const progressArray = [];

  for (const practiceWord of practiceWordsArray) {

    const level = calculateWordLevel(practiceWord);
    
      progressArray.push({
          wordId: practiceWord.id,
          attempts: practiceWord.userWords.length,
          level: level,
      });
  }

  // Convert lessons map to an array
  return progressArray;
}

export function calculateWordLevel(word: PracticeWord ): number {
    // Get the level of the latest attempt
    let level = 1;  // default level if user never attempted

    if (word?.userWords) {
        // Sort userWords by attemptedAt in desc order
        const sortedUserWords = [...word.userWords].sort((a, b) => {
            return (b?.attemptedAt.getTime() ?? 0) -( a?.attemptedAt.getTime() ?? 0) ;
        });
        if (sortedUserWords.length > 0) {
        level = sortedUserWords[0]?.level ?? 1;
     }
    }
    return level;

}