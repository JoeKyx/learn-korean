import Image from 'next/image';
import React from 'react';

import { getImageUrlForAchievment } from '@/lib/helper';
import { Achievment } from '@/lib/types';

type AchievementToastProps = {
  achievment: Achievment;
};

export default function AchievementToastDescription({
  achievment,
}: AchievementToastProps) {
  const achievmentImageUrl = getImageUrlForAchievment(achievment);

  return (
    <div className='flex gap-2'>
      <Image
        src={achievmentImageUrl}
        alt={achievment.name}
        width={50}
        height={50}
      />
      <p>
        {`Congratulations, you finished the ${achievment.name} achievement.`}{' '}
      </p>
    </div>
  );
}
