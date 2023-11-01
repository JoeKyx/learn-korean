"use client"
import { Plus } from 'lucide-react';
import { FC, forwardRef } from 'react'
import { HTMLAttributes } from 'react';
import { useState } from 'react';

import Button from '@/components/buttons/Button';
import { useSettings } from '@/components/context/settingsContext';
import AddNewLessonForm from '@/components/lessons/AddNewLessonForm';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type AddNewLessonButtonProps = HTMLAttributes<HTMLButtonElement>;

const AddNewLessonButton: FC<AddNewLessonButtonProps> = forwardRef<HTMLButtonElement, AddNewLessonButtonProps>((props, ref) => {
  const { className, ...rest } = props;

  const [open, setOpen] = useState(false);
  const { language } = useSettings();
  const closeModal = () => setOpen(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button leftIcon={Plus} className={className} ref={ref} {...rest}>
          Add New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <AddNewLessonForm closeModal={closeModal} languageId={language.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default AddNewLessonButton;