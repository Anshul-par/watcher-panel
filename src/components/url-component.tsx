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
import { useParams } from "react-router-dom";
import useGetUrl from "@/data/query/useGetUrl";
import { Spinner } from "./ui/spinner";
import useGetProjects from "@/data/query/useGetProjects";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";

type FormInputs = {
  name: string;
  url: string;
  urlWithIpPort: string;
  cronSchedule: number;
  timeout: number;
  method: string;
  project: any;
  body?: string;
  headers?: string;
};

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[200px] font-mono text-sm"
    />
  );
}

interface JSONPreviewProps {
  data: object;
}

export function JSONPreview({ data }: JSONPreviewProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <pre className="text-sm overflow-auto max-h-60">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

interface JSONEditorModalProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  disabled?: boolean;
}

export function JSONEditorModal({
  value,
  onChange,
  title,
  disabled,
}: JSONEditorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsedValue = JSON.parse(localValue); // Validate JSON
      onChange(parsedValue); // Only call onChange if JSON is valid
      setError(null);
      setIsOpen(false);
    } catch (err) {
      setError("Invalid JSON format. Please fix the errors and try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <BookOpen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Editor
              value={localValue}
              onChange={(newValue) => {
                setLocalValue(newValue);
                setError(null); // Clear error when user starts editing
              }}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </TabsContent>
          <TabsContent value="preview">
            {(() => {
              try {
                const parsedData = JSON.parse(localValue);
                return <JSONPreview data={parsedData} />;
              } catch {
                return (
                  <p className="text-red-500">
                    Cannot preview. Invalid JSON format.
                  </p>
                );
              }
            })()}
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UpdateDetailsForm({
  initialData,
}: {
  initialData: FormInputs;
}) {
  const { data: projects, isLoading: projectsLoading } = useGetProjects();
  const form = useForm<FormInputs>({
    values: {
      ...initialData,
      project: initialData.project._id,
      body: JSON.stringify(initialData.body || {}, null, 2),
      headers: JSON.stringify(initialData.headers || {}, null, 2),
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    console.log(formData);
  };

  if (projectsLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>URL Details</CardTitle>
          <CardDescription>
            Update the details for {initialData.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                      <Input placeholder="shadcn" {...field} />
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
                      <Input placeholder="shadcn" {...field} />
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
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
            {form.formState.isSubmitting ? "Updating..." : "Update Details"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export const UpdateDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetUrl({ urlId: id || "" });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="sm" className="bg-black dark:bg-white" />
      </div>
    );
  }

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
    >
      <UpdateDetailsForm initialData={data.data[0]} />
    </div>
  );
};
