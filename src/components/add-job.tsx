import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useGetProjects from "@/data/query/useGetProjects";
import useGetProjectUrls from "@/data/query/useGetProjectUrls";
import useGetUrl from "@/data/query/useGetUrl";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Spinner } from "./ui/spinner";
import { ErrorMessage } from "./layout/errormessage";

export const AddJobForm = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const {
    data: projects,
    // isLoading: projectsLoading,
    // isError: projectsError,
  } = useGetProjects();
  const {
    data: urls,
    // isLoading: urlLoading,
    // isError: urlError,
  } = useGetProjectUrls({
    project: selectedProject,
  });
  const {
    data: isInProcess,
    isLoading: isInProcessLoading,
    isError: isInProcessError,
  } = useGetUrl({ urlId: selectedUrl });

  const form = useForm({});

  const handleSubmit = (data: any) => {
    console.log("Submitted:", { ...data });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Job on URL</DialogTitle>
          <DialogDescription>
            Select a project and URL to process.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.clearErrors();
              form.handleSubmit(handleSubmit)(e);
            }}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        setSelectedProject(e);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a Project"
                          className="capitalize"
                        />
                      </SelectTrigger>
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
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URLs</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        setSelectedUrl(e);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a URL"
                          className="capitalize"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {urls?.data?.map((url) => (
                          <SelectItem
                            key={url._id}
                            value={url._id}
                            className="capitalize"
                          >
                            {url.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <>
                {isInProcessLoading && <Spinner className="bg-black" />}
                {isInProcessError && (
                  <ErrorMessage message="Error loading status" />
                )}
                {isInProcess && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={() => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Status: </FormLabel>
                        <Badge
                          variant="outline"
                          className={`col-span-3 ${
                            isInProcess?.data?.[0]?.inProcess
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }`}
                        >
                          {isInProcess?.data?.[0]?.inProcess
                            ? "Under Process"
                            : "Not Under Process"}
                        </Badge>
                      </FormItem>
                    )}
                  />
                )}
              </>
            </div>
            {form.formState.errors["formError"] && (
              <FormMessage className="text-[0.8rem] text-red-600 text-center">
                Error: {form.formState.errors["formError"]?.message?.toString()}
              </FormMessage>
            )}
            <hr className="border-t border-gray-200 mb-[16px]" />
            <DialogFooter>
              <div className="flex flex-col space-y-4 w-full">
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">
                    Warning: Adding a job that is{" "}
                    <b>
                      <i>under-process</i>
                    </b>{" "}
                    will wipe all past data and start with a new one.
                  </span>
                </div>
                <Button type="submit">Submit</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
