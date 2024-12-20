import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardFooter } from "@/components/ui/card";
import { Spinner } from "./ui/spinner";
import {
  Form as UIForm,
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateProject } from "@/data/mutation/useCreateProject";
import { useUpdateProject } from "@/data/mutation/useUpdateProject";
import useGetUsers from "@/data/query/useGetUsers";
import useGetProjects from "@/data/query/useGetProjects";

type FormInputs = {
  name: string;
  description: string;
  owner: string;
};

const Form = ({ values, action, id }) => {
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const { mutate: createMutateProject } = useCreateProject();
  const { mutate: updateMutateProject } = useUpdateProject();

  const form = useForm<FormInputs>({
    values: {
      ...values,
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (action === "UPDATE") {
      updateMutateProject(
        {
          id: id || "",
          updatedData: data,
        },
        {
          onSuccess: () => {
            navigate(-1);
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
      createMutateProject(
        {
          data: {
            ...data,
          },
        },
        {
          onSuccess: () => {
            navigate(-1);
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
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{`${
            action == "ADD" ? "Add" : "Update"
          } Project Details`}</DialogTitle>
          <DialogDescription>
            {`${action == "ADD" ? "Add" : "Update"} the project details.`}
          </DialogDescription>
        </DialogHeader>
        <UIForm {...form}>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select a User"
                        className="capitalize"
                      />
                    </SelectTrigger>
                    {usersLoading ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <SelectContent>
                        {users?.data?.map((project) => (
                          <SelectItem
                            key={project._id}
                            value={project._id}
                            className="capitalize"
                          >
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
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
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-w-[48%]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Adding..."
                  : action == "ADD"
                  ? "Add Project"
                  : "Update Project"}
              </Button>
            </CardFooter>
          </form>
        </UIForm>
      </DialogContent>
    </Dialog>
  );
};

export const ProjectForm = () => {
  const [searchParams] = useSearchParams();

  const action = (searchParams.get("action") as "ADD" | "UPDATE") || "ADD";
  const id = searchParams.get("id");

  const { data: projectDetails, isLoading: projectDetailsLoading } =
    useGetProjects(id || "");

  if (projectDetailsLoading) {
    return <Spinner size={"sm"} className="" />;
  }

  return (
    <Form
      values={{
        name: projectDetails?.data?.[0]?.name,
        description: projectDetails?.data?.[0]?.description,
        owner: projectDetails?.data?.[0]?.owner,
      }}
      action={action}
      id={id}
    />
  );
};
