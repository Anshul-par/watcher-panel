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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";
import useGetProjects from "@/data/query/useGetProjects";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { JSONEditorModal } from "./json-preview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useUpdateUrl } from "@/data/mutation/useUpdateUrl";
import { useDeleteUrl } from "@/data/mutation/useDeleteUrl";

interface DeleteModalProps {
  isOpen: boolean;
  setIsOpen: (boolean) => void;
  onDelete: () => void;
}

export const DeleteModal = ({
  isOpen,
  setIsOpen,
  onDelete,
}: DeleteModalProps) => {
  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type FormInputs = {
  _id: string;
  name: string;
  url: string;
  urlWithIpPort: string;
  cronSchedule: number;
  timeout: number;
  method: string;
  project: any;
  createdAt?: string;
  updatedAt?: string;
  body?: string;
  headers?: string;
};

export const UpdateDetailsForm = ({
  initialData,
}: {
  initialData: FormInputs;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { data: projects, isLoading: projectsLoading } = useGetProjects();
  const { mutate: deleteMutateUrl } = useDeleteUrl();
  const { mutate: updateMutateUrl } = useUpdateUrl();
  const form = useForm<FormInputs>({
    values: {
      ...initialData,
      project: initialData.project._id,
      body: JSON.stringify(initialData.body || {}, null, 2),
      headers: JSON.stringify(initialData.headers || {}, null, 2),
    },
  });

  const onDelete = () => {
    //@ts-ignore
    deleteMutateUrl(
      { id: initialData._id },
      {
        onSuccess: () => navigate("/"),
      }
    );
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    delete data.createdAt;
    delete data.updatedAt;

    //@ts-ignore
    updateMutateUrl(
      {
        id: data._id,
        updatedData: {
          ...data,
          body: JSON.parse(data.body || "{}"),
          headers: JSON.parse(data.headers || "{}"),
        },
      },
      {
        onError: (e) =>
          //@ts-ignore
          form.setError("formError", {
            type: "custom",
            //@ts-ignore
            message: e.response.data.message,
          }),
      }
    );
  };

  if (projectsLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>URL Details</CardTitle>
          <CardDescription>
            Update the details for {initialData.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} type="url" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="urlWithIpPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL with IP and Port</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cronSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cron Time (in seconds)</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} type="number" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (in seconds)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        {...field}
                        value={field.value}
                        type="number"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTTP Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a HTTP Method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PUT">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a Project"
                          className="capitalize"
                        />
                      </SelectTrigger>
                      {
                        <SelectContent>
                          {projects?.data?.map((project) => (
                            <SelectItem
                              key={project._id}
                              value={project._id}
                              className="capitalize"
                            >
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      }
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center ">
                    <div className="flex flex-col">
                      <FormLabel>Edit Body</FormLabel>
                      <FormDescription>
                        The body of the request that will be sent to the server
                      </FormDescription>
                    </div>
                    <FormControl>
                      <JSONEditorModal
                        value={field.value || ""}
                        disabled={form.getValues("method") === "GET"}
                        onChange={field.onChange}
                        title="Body"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headers"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <FormLabel>Edit Headers</FormLabel>
                      <FormDescription>
                        The headers that will be sent along with the request
                      </FormDescription>
                    </div>
                    <FormControl>
                      <JSONEditorModal
                        value={field.value || ""}
                        onChange={field.onChange}
                        title="Headers"
                      />
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
                  onClick={() => setIsOpen(true)}
                  variant={"outline"}
                  className="min-w-[48%] border-red-500 text-red-500"
                  disabled={form.formState.isSubmitting}
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  className="min-w-[48%]"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Updating..."
                    : "Update Details"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
      <DeleteModal isOpen={isOpen} setIsOpen={setIsOpen} onDelete={onDelete} />
    </>
  );
};
