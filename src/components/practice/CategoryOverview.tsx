import { QuestionMarkIcon } from '@radix-ui/react-icons';
import React, { FC, useState } from 'react';

import { WordCategorie } from '@/lib/db/schema/wordCategories';
import logger from '@/lib/logger';
import { cn } from '@/lib/utils';

import { useWordPractice } from '@/components/practice/WordPracticeContext';
import { icons } from '@/components/practice/WordSwiper';

const CategoryOverview: FC = () => {
  const [currentCategoryFilters, setCurrentCategoryFilters] = useState<
    WordCategorie[]
  >([]);
  const practiceContext = useWordPractice();

  const { wordCategories } = practiceContext.state;

  const onCategoryClickHandler = (category: WordCategorie) => {
    logger(category, 'Clicked Category');
    let tmpCategoryFilters = currentCategoryFilters;
    if (currentCategoryFilters.includes(category)) {
      tmpCategoryFilters = currentCategoryFilters.filter(
        (currentCategory) => currentCategory.id !== category.id
      );
    } else {
      tmpCategoryFilters.push(category);
    }
    setCurrentCategoryFilters(tmpCategoryFilters);
    practiceContext.dispatch({
      type: 'SET_FILTERS',
      payload: { categories: tmpCategoryFilters },
    });
  };

  function CategoryIcon({
    category,
    isSelected,
  }: {
    category: WordCategorie;
    isSelected: boolean;
  }) {
    const IconComponent =
      icons.find((icon) => icon.name === category.name)?.icon ||
      QuestionMarkIcon;

    return (
      <IconComponent
        key={category.id}
        size={24}
        style={isSelected ? { fill: category.color } : {}}
      />
    );
  }

  return (
    <div className='flex gap-2'>
      {wordCategories.map((category) => {
        const isSelected = currentCategoryFilters.some(
          (currentCategory) => currentCategory.id === category.id
        );

        return (
          <div
            className={cn('p-2 bg-primary-200', isSelected && 'bg-primary-400')}
            onClick={() => onCategoryClickHandler(category)}
            key={category.id}
          >
            <CategoryIcon
              key={category.id}
              category={category}
              isSelected={isSelected}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CategoryOverview;
