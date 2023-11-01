"use client";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertLessonParams, Lesson, NewLessonParams, USER_LESSON_ID } from "@/lib/db/schema/lessons";
import logger from "@/lib/logger";
import { trpc } from "@/lib/trpc/client";

import Button from "@/components/buttons/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
const LessonForm = ({
  lesson,
  closeModal,
  languageId
}: {
  lesson?: Lesson;
  closeModal?: () => void;
  languageId: number;
}) => {
  const { toast } = useToast();

  const editing = !!lesson?.id;

  const router = useRouter();
  const utils = trpc.useContext();
  const user = useUser();


  const form = useForm<z.infer<typeof insertLessonParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertLessonParams),
    defaultValues: lesson ?? {
      name: "",
      level: 1,
      lessonNumber: 1,
      languageId: languageId,
      link: null,
      lessonCategoryId: USER_LESSON_ID,
      userId: user.user?.id ?? null,
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.lessons.getLessons.invalidate();
    router.refresh();
    if (closeModal) {
      closeModal();
    }
    toast({
      title: 'Success',
      description: `Lesson ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createLesson, isLoading: isCreating } =
    trpc.lessons.createLesson.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateLesson, isLoading: isUpdating } =
    trpc.lessons.updateLesson.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteLesson, isLoading: isDeleting } =
    trpc.lessons.deleteLesson.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewLessonParams) => {
    if (editing) {
      logger(values, 'Updating lesson')
      logger(lesson.id, 'Lesson ID')
      updateLesson({ ...values, id: lesson.id });
    } else {
      logger(values, 'Creating lesson')
      createLesson(values);
    }
  };

  const handleError = (error: any) => {
    logger(error, 'Error creating lesson')
    toast({
      title: "Error",
      description: error.message,
    });
  }

  const deleteHandler = () => {
    if (lesson) {
      deleteLesson(lesson);
    }
    router.back();

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-8">
        <span>Craft your own Lesson. Create your lesson here and then add the words you want to assign to it.</span>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lessonNumber"
          render={({ field }) => (<FormItem>
            <FormLabel>Lesson Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (<FormItem>
            <FormLabel>Level (Difficulty)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <>
          <Button
            type="submit"
            className="mr-1"
            disabled={isCreating || isUpdating
            }
          >
            {editing
              ? `Sav${isUpdating ? "ing..." : "e"}`
              : `Creat${isCreating ? "ing..." : "e"}`}
          </Button>
          {editing ? (
            <Button
              type="button"
              onClick={deleteHandler}
            >
              Delet{isDeleting ? "ing..." : "e"}
            </Button>
          ) : null}
        </>
      </form>

    </Form>
  );
};

export default LessonForm;
