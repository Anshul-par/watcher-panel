import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateUser } from "@/data/mutation/useCreateUser";
import { useUpdateUser } from "@/data/mutation/useUpdateUser";

type FormInputs = {
  name: string;
  slackUserId: string;
  title: string;
};

type UserFormProps = {
  action: "ADD" | "UPDATE";
  id?: string;
  values?: FormInputs;
  isOpen: boolean;
  setIsOpen: any;
};

export const UserForm = ({
  action,
  id,
  values,
  isOpen,
  setIsOpen,
}: UserFormProps) => {
  const { mutate: createMutateUser } = useCreateUser();
  const { mutate: updateMutateUser } = useUpdateUser();

  const form = useForm<FormInputs>({
    values: {
      name: values?.name || "",
      slackUserId: values?.slackUserId || "",
      title: values?.title || "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (action === "UPDATE") {
      updateMutateUser(
        {
          id: id || "",
          updatedData: data,
        },
        {
          onSuccess: () => {
            setIsOpen((prevState) => ({
              ...prevState,
              isOpen: !prevState.isOpen,
            }));
          },
          onError: (e) =>
            //@ts-ignore
            form.setError("formError", {
              type: "custom",
              //@ts-ignore
              message: e.response.data.message,
            }),
        }
      );
    } else {
      createMutateUser(
        {
          data: {
            ...data,
          },
        },
        {
          onSuccess: () => {
            setIsOpen((prevState) => ({
              ...prevState,
              isOpen: !prevState.isOpen,
            }));
          },
          onError: (e) =>
            //@ts-ignore
            form.setError("formError", {
              type: "custom",
              //@ts-ignore
              message: e.response.data.message,
            }),
        }
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      modal={true}
      onOpenChange={() => {
        setIsOpen((prevState) => ({
          ...prevState,
          isOpen: !prevState.isOpen,
        }));

        // setTimeout(() => (document.body.style.pointerEvents = ""), 100);
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{`${
            action == "ADD" ? "Add" : "Update"
          } Project Details`}</DialogTitle>
          <DialogDescription>
            {`${action == "ADD" ? "Add" : "Update"} the project details.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.clearErrors();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slackUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slack ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Slack ID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.formState.errors["formError"] && (
              <FormMessage className="text-[0.8rem] text-red-600 text-center">
                Error: {form.formState.errors["formError"].message}
              </FormMessage>
            )}

            <br />
            <CardFooter className="flex justify-between items-center p-0 mt-8">
              <Button
                type="button"
                variant={"outline"}
                className="min-w-[48%]"
                disabled={form.formState.isSubmitting}
                onClick={() =>
                  setIsOpen((prevState) => ({
                    ...prevState,
                    isOpen: !prevState.isOpen,
                  }))
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-w-[48%]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Project"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
