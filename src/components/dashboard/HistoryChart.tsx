'use client';
import { SelectContent, SelectTrigger } from '@radix-ui/react-select';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';

import {
  getAttemptsLast7Days,
  getAttemptsLast10Weeks,
  getAttemptsLast12Months,
} from '@/lib/api/datesStudied/helper';
import { DatesStudied } from '@/lib/db/schema/lessons';
import logger from '@/lib/logger';

import Button from '@/components/buttons/Button';
import { Select, SelectItem, SelectValue } from '@/components/ui/select';

type HistoryChartProps = {
  datesStudied: DatesStudied;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type HistoryMode = 'last7Days' | 'last10Weeks' | 'last12Months';

export default function HistoryChart({ datesStudied }: HistoryChartProps) {
  const ref = useRef(null);

  // get the attempts from datesStudied per month over the last 12 months

  const last12Months = getAttemptsLast12Months(datesStudied);
  const last10Weeks = getAttemptsLast10Weeks(datesStudied);
  const last7Days = getAttemptsLast7Days(datesStudied);

  const last12MonthsLabels = last12Months.map((d) => d.label);
  const last10WeeksLabels = last10Weeks.map((d) => d.label);
  const last7DaysLabels = last7Days.map((d) => d.label);

  const [historyMode, setHistoryMode] =
    React.useState<HistoryMode>('last7Days');

  const [hydrated, setHydrated] = React.useState(false);

  useEffect(() => {
    if (hydrated) return;
    setHydrated(true);
  }, [hydrated]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const colors = {
    attempts: 'rgb(54, 162, 235)',
    success: 'rgb(75, 181,67)',
  };

  logger(last7DaysLabels, 'last7DaysLabels');

  const last7DaysChartData = {
    labels: last7DaysLabels,
    datasets: [
      {
        label: 'Attempts',
        data: last7Days.map((d) => d.attempts),
        backgroundColor: colors.attempts,
      },
      {
        label: 'Successes',
        data: last7Days.map((d) => d.successful),
        backgroundColor: colors.success,
      },
    ],
  };

  const last10WeeksChartData = {
    labels: last10WeeksLabels,
    datasets: [
      {
        label: 'Attempts',
        data: last10Weeks.map((d) => d.attempts),
        backgroundColor: colors.attempts,
      },
      {
        label: 'Successes',
        data: last10Weeks.map((d) => d.successful),
        backgroundColor: colors.success,
      },
    ],
  };

  const last12MonthsChartData = {
    labels: last12MonthsLabels,
    datasets: [
      {
        label: 'Attempts',
        data: last12Months.map((d) => d.attempts),
        backgroundColor: colors.attempts,
      },
      {
        label: 'Successes',
        data: last12Months.map((d) => d.successful),
        backgroundColor: colors.success,
      },
    ],
  };

  const chartData = () => {
    switch (historyMode) {
      case 'last7Days':
        return last7DaysChartData;
      case 'last10Weeks':
        return last10WeeksChartData;
      case 'last12Months':
        return last12MonthsChartData;
      default:
        return last7DaysChartData;
    }
  };

  if (!hydrated) return null;

  return (
    <div>
      <div className='flex gap-2 mb-2'>
        <Select
          value={historyMode}
          onValueChange={(value) => setHistoryMode(value as HistoryMode)}
        >
          <SelectTrigger>
            <Button variant='ghost'>
              <SelectValue placeholder='Last 7 days' />
            </Button>
          </SelectTrigger>
          <SelectContent className='rounded-md'>
            <SelectItem defaultChecked value='last7Days'>
              Last 7 days
            </SelectItem>
            <SelectItem value='last10Weeks'>Last 10 weeks</SelectItem>
            <SelectItem value='last12Months'>Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Bar data={chartData()} options={options} ref={ref} />
    </div>
  );
}
