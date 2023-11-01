'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LessonId } from '@/lib/db/schema/lessons';
import { insertWordParams, NewWordParams, Word } from '@/lib/db/schema/words';
import logger from '@/lib/logger';
import { trpc } from '@/lib/trpc/client';

import Button from '@/components/buttons/Button';
import { useSettings } from '@/components/context/settingsContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
const WordForm = ({
  word,
  lessonId,
  closeModal,
}: {
  word?: Word;
  lessonId: LessonId;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!word?.id;

  const router = useRouter();
  const utils = trpc.useContext();
  const userSettings = useSettings();

  const form = useForm<z.infer<typeof insertWordParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertWordParams),
    defaultValues: word ?? {
      wordEng: '',
      wordDe: '',
      wordKor: '',
      level: 1,
      userId: userSettings.userId,
      pronunciation: '',
      lessonId: lessonId,
      hint: null,
    },
  });

  const onSuccess = (action: 'create' | 'update' | 'delete') => {
    utils.lessons.getLessons.invalidate();
    router.refresh();
    if (closeModal) {
      closeModal();
    }
    toast({
      title: 'Success',
      description: `Word ${action}d!`,
      variant: 'default',
    });
  };

  const { mutate: createWord, isLoading: isCreating } =
    trpc.words.createWord.useMutation({
      onSuccess: () => onSuccess('create'),
    });

  const { mutate: updateWord, isLoading: isUpdating } =
    trpc.words.updateWord.useMutation({
      onSuccess: () => onSuccess('update'),
    });

  const { mutate: deleteWord, isLoading: isDeleting } =
    trpc.words.deleteWord.useMutation({
      onSuccess: () => onSuccess('delete'),
    });

  const handleSubmit = (values: NewWordParams) => {
    logger(values, 'new Word: ');

    if (editing) {
      updateWord({ ...values, id: word.id });
    } else {
      createWord(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='wordEng'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word (English)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='wordDe'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word (German)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='wordKor'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='pronunciation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pronounciation</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='mr-1'
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? 'ing...' : 'e'}`
            : `Creat${isCreating ? 'ing...' : 'e'}`}
        </Button>
        {editing ? (
          <Button type='button' onClick={() => deleteWord(word)}>
            Delet{isDeleting ? 'ing...' : 'e'}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default WordForm;
