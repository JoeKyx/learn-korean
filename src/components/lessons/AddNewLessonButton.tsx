"use client"
import Button from '@/components/buttons/Button';
import { Plus } from 'lucide-react';
import { FC, forwardRef, useEffect } from 'react'
import { HTMLAttributes } from 'react';
import { useSettings } from '@/components/context/settingsContext';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import AddNewLessonForm from '@/components/lessons/AddNewLessonForm';
import TestingModelForm from '@/components/testingModels/TestingModelForm';

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