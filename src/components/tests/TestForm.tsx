"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertTestParams, NewTestParams, Test } from "@/lib/db/schema/tests";
import { trpc } from "@/lib/trpc/client";

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

import { Button } from "../ui/button";

const TestForm = ({
  test,
  closeModal,
}: {
  test?: Test;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!test?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertTestParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertTestParams),
    defaultValues: test ?? {
      test: ""
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.tests.getTests.invalidate();
    router.refresh();
    closeModal(); toast({
      title: 'Success',
      description: `Test ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createTest, isLoading: isCreating } =
    trpc.tests.createTest.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateTest, isLoading: isUpdating } =
    trpc.tests.updateTest.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteTest, isLoading: isDeleting } =
    trpc.tests.deleteTest.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewTestParams) => {
    if (editing) {
      updateTest({ ...values, id: test.id });
    } else {
      createTest(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="test"
          render={({ field }) => (<FormItem>
            <FormLabel>Test</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

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
            onClick={() => deleteTest({ id: test.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default TestForm;
