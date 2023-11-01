import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import logger from '@/lib/logger';

import { toast } from '@/components/ui/use-toast';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  if (typeof error === 'string') {
    toast({
      title: 'Error',
      description: error,
    });
    return;
  } else if (error instanceof Error) {
    logger(error, 'Error creating lesson');
    toast({
      title: 'Error',
      description: error.message,
    });
  }
};
