'use client';
import { Plus } from 'lucide-react';
import { FC, forwardRef } from 'react';
import { HTMLAttributes } from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import { useSettings } from '@/components/context/settingsContext';
import AddNewLessonForm from '@/components/lessons/AddNewLessonForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type AddNewLessonButtonProps = HTMLAttributes<HTMLButtonElement>;

const AddNewLessonButton: FC<AddNewLessonButtonProps> = forwardRef<
  HTMLButtonElement,
  AddNewLessonButtonProps
>((props, ref) => {
  const { className, ...rest } = props;

  const [_open, setOpen] = useState(false);
  const { language } = useSettings();
  const closeModal = () => setOpen(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          leftIcon={Plus}
          className={cn(className, 'group')}
          ref={ref}
          {...rest}
          classNames={{
            leftIcon:
              'group-hover:rotate-180 transition-all duration-150 ease-in-out',
          }}
        >
          Add New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='px-5 pt-5'>
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>
        <div className='px-5 pb-5'>
          <AddNewLessonForm closeModal={closeModal} languageId={language.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default AddNewLessonButton;
