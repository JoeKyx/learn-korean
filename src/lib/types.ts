import { HOME_LINKS, REASONS } from '@/lib/data';
import { Lesson } from '@/lib/db/schema/lessons';

export type ReasonType = (typeof REASONS)[number];

export type SectionName = (typeof HOME_LINKS)[number]['text'];

export type HistoryChartData = {
  label: string;
  attempts: number;
  successful: number;
};

export type CategoryWithLesson = {
  name: string;
  id: number;
  image?: string | undefined;
  lessons: Lesson[];
};

export type Achievment = {
  name: string;
  description: string;
  type: 'card';
  image: string;
};
