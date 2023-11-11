'use client';
import { HoverCardContent } from '@radix-ui/react-hover-card';
import { format, subDays } from 'date-fns';

import { DatesStudied } from '@/lib/db/schema/lessons';
import { cn } from '@/lib/utils';

import HistoryChart from '@/components/dashboard/HistoryChart';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';

export default function Calendar({
  datesStudied,
  className,
}: {
  datesStudied: DatesStudied;
  className?: string;
}) {
  // Function to get the last 7 days including today
  const getLast7Days = () => {
    return Array(7)
      .fill(null)
      .map((_, idx) => ({
        formatted: format(subDays(new Date(), 6 - idx), 'd MMM'),
        day: format(subDays(new Date(), 6 - idx), 'd'),
        month: format(subDays(new Date(), 6 - idx), 'MMM'),
        iso: format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd'),
        attempts:
          datesStudied.find(
            (ds) =>
              ds.datesStudie ===
              format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd')
          )?.attempts ?? 0,
        successful:
          datesStudied.find(
            (ds) =>
              ds.datesStudie ===
              format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd')
          )?.successful ?? 0,
        successRate:
          (datesStudied.find(
            (ds) =>
              ds.datesStudie ===
              format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd')
          )?.successful ?? 0) /
            (datesStudied.find(
              (ds) =>
                ds.datesStudie ===
                format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd')
            )?.attempts ?? 0) ?? null,
      }));
  };

  const last7Days = getLast7Days();

  // Get the sum of all attempts in the last 7 days
  const summedAttemptsLast7Days = last7Days.reduce(
    (acc, curr) => acc + Number(curr.attempts),
    0
  );
  const summedSuccessLast7Days = last7Days.reduce(
    (acc, curr) => acc + Number(curr.successful),
    0
  );

  return (
    <section
      className={cn(
        className,
        'flex flex-col gap-2 border-black/25 border p-4 bg-gradient-to-br from-primary-200/70 to-primary-300/70 rounded-lg  w-full  drop-shadow-lg'
      )}
    >
      <h1 className='text-slate-800'>Your Progress</h1>
      <p className='text-slate-800'>
        You have swiped{' '}
        <span className='font-semibold'>{summedAttemptsLast7Days} times </span>{' '}
        in the last 7 days.
        {summedAttemptsLast7Days > 0 ? (
          <span>
            Your success rate is{' '}
            <span className='font-semibold'>
              {(
                (summedSuccessLast7Days / summedAttemptsLast7Days) *
                100
              ).toFixed(2)}
              %
            </span>
            . Keep going!
          </span>
        ) : (
          <></>
        )}
      </p>
      <div className='flex flex-wrap gap-2 justify-center'>
        {last7Days.map(({ day, month, iso, attempts, successRate }) => (
          <HoverCard key={iso} openDelay={300}>
            <HoverCardTrigger>
              <div
                key={iso}
                className={cn(
                  'flex flex-col justify-center items-center p-2 rounded-full transition-all text-white md:w-16 md:h-16 h-16 w-16 text-xs md:text-sm border border-primary-600 ease-in-out duration-300',
                  datesStudied.some(
                    (dateStudied) =>
                      dateStudied.datesStudie === iso &&
                      dateStudied.attempts >= 5
                  )
                    ? 'bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600'
                    : // check if the date is today, then it should be yellow else red
                    iso === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
                    : 'bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                )}
              >
                <span className='font-bold'>{day}</span>
                <span className='font-semibold'>{month}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className='p-2 rounded-md border-primary-500 border bg-slate-100 flex flex-col mt-2'>
              <div>
                <span className='font-bold text-primary-500'>Swipes: </span>
                <span>{attempts}</span>
              </div>

              {successRate ? (
                <div>
                  <span className='font-semibold text-primary-500'>
                    Correct:{' '}
                  </span>
                  <span>{(successRate * 100).toFixed(2) + '%'}</span>
                </div>
              ) : null}
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      <HistoryChart datesStudied={datesStudied} />
    </section>
  );
}
