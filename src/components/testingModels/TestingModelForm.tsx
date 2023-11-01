"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertTestingModelParams,NewTestingModelParams, TestingModel } from "@/lib/db/schema/testingModels";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const TestingModelForm = ({
  testingModel,
  closeModal,
}: {
  testingModel?: TestingModel;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  const { data: languages } = trpc.languages.getLanguages.useQuery();
  const editing = !!testingModel?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertTestingModelParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertTestingModelParams),
    defaultValues: testingModel ?? {
      name: "",
     anumbers: 0,
     aBoolean: false,
     languageId: 0
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.testingModels.getTestingModels.invalidate();
    router.refresh();
    closeModal();toast({
      title: 'Success',
      description: `Testing Model ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createTestingModel, isLoading: isCreating } =
    trpc.testingModels.createTestingModel.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateTestingModel, isLoading: isUpdating } =
    trpc.testingModels.updateTestingModel.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteTestingModel, isLoading: isDeleting } =
    trpc.testingModels.deleteTestingModel.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewTestingModelParams) => {
    if (editing) {
      updateTestingModel({ ...values, id: testingModel.id });
    } else {
      createTestingModel(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="anumbers"
          render={({ field }) => (<FormItem>
              <FormLabel>Anumbers</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aBoolean"
          render={({ field }) => (<FormItem>
              <FormLabel>A Boolean</FormLabel>
                <br />
            <FormControl>
              <Checkbox {...field} checked={!!field.value} onCheckedChange={field.onChange} value="" />
            </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languageId"
          render={({ field }) => (<FormItem>
              <FormLabel>Language Id</FormLabel>
                <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages?.languages.map((language) => (
                      <SelectItem key={language.id} value={language.id.toString()}>
                        {language.id}  {/* TODO: Replace with a field from the language model */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            onClick={() => deleteTestingModel({ id: testingModel.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default TestingModelForm;
