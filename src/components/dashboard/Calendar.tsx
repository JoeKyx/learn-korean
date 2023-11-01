"use client"
import { HoverCardContent } from "@radix-ui/react-hover-card";
import { format,subDays } from 'date-fns';

import { DatesStudied } from "@/lib/db/schema/lessons";
import { cn } from "@/lib/utils";

import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";


export default function Calendar({ datesStudied, className }: { datesStudied: DatesStudied, className?: string, }) {

  // Function to get the last 7 days including today
  const getLast7Days = () => {
    return Array(7)
      .fill(null)
      .map((_, idx) => ({
        formatted: format(subDays(new Date(), 6 - idx), 'd MMM'),
        day: format(subDays(new Date(), 6 - idx), 'd'),
        month: format(subDays(new Date(), 6 - idx), 'MMM'),
        iso: format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd'),
        attempts: datesStudied.find(ds => ds.datesStudie === format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd'))?.attempts ?? 0,
        successful: datesStudied.find(ds => ds.datesStudie === format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd'))?.successful ?? 0,
        successRate: (datesStudied.find(ds => ds.datesStudie === format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd'))?.successful ?? 0) / (datesStudied.find(ds => ds.datesStudie === format(subDays(new Date(), 6 - idx), 'yyyy-MM-dd'))?.attempts ?? 0) ?? null
      }));
  };

  const last7Days = getLast7Days();

  return (
    <div className={cn(className, 'flex gap-2')}>
      {
        last7Days.map(({ day, month, formatted, iso, attempts, successRate }) => (
          <HoverCard key={iso} openDelay={300}>
            <HoverCardTrigger>
              <div
                key={iso}
                className={cn(
                  'flex flex-col justify-center items-center p-2 rounded-full text-white md:w-20 md:h-20 h-12 w-12 text-xs md:text-lg border border-primary-600 transition-colors ease-in-out duration-300',
                  datesStudied.some(dateStudied => dateStudied.datesStudie === iso && dateStudied.attempts >= 5) ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                )}
              >
                <span className="font-bold">{day}</span>
                <span className="font-semibold">{month}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 rounded-md border-primary-500 border bg-slate-100 flex flex-col mt-2">
              <div>
                <span className="font-bold text-primary-500">Swipes: </span><span>{attempts}</span>
              </div>

              {successRate ? <div>
                <span className="font-semibold text-primary-500">Correct: </span><span>{(successRate * 100).toFixed(2) + '%'}</span>
              </div>
                : null}

            </HoverCardContent>
          </HoverCard>
        ))
      }
    </div>
  )
}