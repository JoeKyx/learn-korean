import { format, subDays, subMonths, subWeeks } from 'date-fns';

import { DatesStudied } from '@/lib/db/schema/lessons';
import logger from '@/lib/logger';
import { HistoryChartData } from '@/lib/types';

export const getAttemptsLast12Months = (
  datesStudied: DatesStudied
): HistoryChartData[] => {
  const last12Months = Array(12)
    .fill(null)
    .map((_, idx) => ({
      month: format(subMonths(new Date(), 11 - idx), 'MMM'),
      year: format(subMonths(new Date(), 11 - idx), 'yyyy'),
      label: format(subMonths(new Date(), 11 - idx), 'MMM yyyy'),
      attempts: 0,
      successful: 0,
    }));

  // Add the attempts to the last12Months array
  datesStudied.forEach((ds) => {
    const month = format(new Date(ds.datesStudie), 'MMM');
    const year = format(new Date(ds.datesStudie), 'yyyy');

    const attempts = ds.attempts;
    const successful = ds.successful;
    const index = last12Months.findIndex(
      (d) => d.month === month && d.year === year
    );
    if (index !== -1) {
      last12Months[index].attempts += Number(attempts);
      last12Months[index].successful += Number(successful);
    }
  });
  return last12Months;
};

export const getAttemptsLast10Weeks = (
  datesStudied: DatesStudied
): HistoryChartData[] => {
  const last10Weeks = Array(10)
    .fill(null)
    .map((_, idx) => ({
      week: format(subWeeks(new Date(), 10 - idx), 'w'),
      year: format(subWeeks(new Date(), 10 - idx), 'yyyy'),
      label: format(subWeeks(new Date(), 10 - idx), 'w MMM'),
      attempts: 0,
      successful: 0,
    }));

  // Add the attempts to the last12Months array
  datesStudied.forEach((ds) => {
    const week = format(new Date(ds.datesStudie), 'w');
    const year = format(new Date(ds.datesStudie), 'yyyy');
    const attempts = ds.attempts;
    const successful = ds.successful;
    const index = last10Weeks.findIndex(
      (d) => d.week === week && d.year === year
    );
    if (index !== -1) {
      last10Weeks[index].attempts += Number(attempts);
      last10Weeks[index].successful += Number(successful);
    }
  });

  logger(last10Weeks, 'last10Weeks');
  return last10Weeks;
};

export const getAttemptsLast7Days = (
  datesStudied: DatesStudied
): HistoryChartData[] => {
  const last7Days = Array(7)
    .fill(null)
    .map((_, idx) => ({
      day: format(subDays(new Date(), 6 - idx), 'd'),
      month: format(subDays(new Date(), 6 - idx), 'MMM'),
      iso: format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd'),
      label: format(subDays(new Date(), 6 - idx), 'EEEE'),
      attempts:
        Number(
          datesStudied.find(
            (ds) =>
              ds.datesStudie ===
              format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd')
          )?.attempts
        ) ?? 0,
      successful:
        Number(
          datesStudied.find(
            (ds) =>
              ds.datesStudie ===
              format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd')
          )?.successful
        ) ?? 0,
    }));

  logger(last7Days, 'last7Days');
  return last7Days;
};
