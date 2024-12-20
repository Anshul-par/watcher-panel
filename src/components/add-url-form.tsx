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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateUrl } from "@/data/mutation/useCreateUrl";
import { useNavigate } from "react-router-dom";

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

export const AddUrlForm = () => {
  const { data: projects, isLoading: projectsLoading } = useGetProjects();
  const { mutate: createMutateUrl } = useCreateUrl();
  const form = useForm<FormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    //@ts-ignore
    createMutateUrl(
      {
        data: {
          ...data,
          body: data.body || {},
          headers: data.headers || {},
        },
      },
      {
        onError: (e) => {
          //@ts-ignore
          form.setError("formError", {
            type: "custom",
            //@ts-ignore
            message: e.response.data.message,
          });
        },
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  if (projectsLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add URL Details</DialogTitle>
          <DialogDescription>
            <>Add the details for URL</>
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
                    <Input placeholder="URL Name" {...field} />
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
                    <Input
                      placeholder="https://finshots.in/"
                      {...field}
                      type="url"
                    />
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
                    <Input placeholder="http://172.168.16.12:5000" {...field} />
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
                    <Input {...field} type="number" />
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
                    <Input {...field} value={field.value} type="number" />
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
                      <SelectItem value="PATCH">PATCH</SelectItem>
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
                {form.formState.isSubmitting ? "Adding..." : "Add Details"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
