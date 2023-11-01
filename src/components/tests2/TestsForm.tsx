"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertTestsParams, NewTestsParams, Tests } from "@/lib/db/schema/tests2";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "../ui/button";

const TestsForm = ({
  tests,
  closeModal,
}: {
  tests?: Tests;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!tests?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertTestsParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertTestsParams),
    defaultValues: tests ?? {
      date: ""
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.tests2.getTests2.invalidate();
    router.refresh();
    closeModal(); toast({
      title: 'Success',
      description: `Tests ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createTests, isLoading: isCreating } =
    trpc.tests2.createTests.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateTests, isLoading: isUpdating } =
    trpc.tests2.updateTests.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteTests, isLoading: isDeleting } =
    trpc.tests2.deleteTests.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewTestsParams) => {
    if (editing) {
      updateTests({ ...values, id: tests.id });
    } else {
      createTests(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (<FormItem>
            <FormLabel>Date</FormLabel>
            <br />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(field.value)}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteTests({ id: tests.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default TestsForm;
