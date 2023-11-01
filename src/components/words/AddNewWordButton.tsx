'use client';
import { Edit, Plus } from 'lucide-react';
import { FC, forwardRef } from 'react';
import { HTMLAttributes } from 'react';
import { useState } from 'react';

import { LessonId } from '@/lib/db/schema/lessons';
import { Word } from '@/lib/db/schema/words';

import Button from '@/components/buttons/Button';
import AddNewWordForm from '@/components/words/AddNewWordForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type AddNewWordButtonProps = HTMLAttributes<HTMLButtonElement> & {
  lessonId: LessonId;
  customTrigger?: React.ReactNode;
  word?: Word;
};

const AddNewWordButton: FC<AddNewWordButtonProps> = forwardRef<
  HTMLButtonElement,
  AddNewWordButtonProps
>((props, ref) => {
  const { className, lessonId, word, customTrigger, ...rest } = props;

  const [_open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  return (
    <Dialog>
      <DialogTrigger asChild={!customTrigger}>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            leftIcon={word ? Edit : Plus}
            className={className}
            ref={ref}
            {...rest}
          >
            {word ? 'Edit' : 'Add New Word'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='px-5 pt-5'>
          <DialogTitle>{word ? 'Edit Word' : 'Add New Word'}</DialogTitle>
        </DialogHeader>
        <div className='px-5 pb-5'>
          <AddNewWordForm
            closeModal={closeModal}
            lessonId={lessonId}
            word={word}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default AddNewWordButton;
