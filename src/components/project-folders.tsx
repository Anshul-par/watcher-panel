import {
  Edit2,
  EllipsisVertical,
  Folder,
  PlusSquare,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import useGetProjects from "@/data/query/useGetProjects";
import { useState } from "react";
import useGetProjectUrls from "@/data/query/useGetProjectUrls";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { useDeleteProject } from "@/data/mutation/useDeleteProject";
import { Spinner } from "./ui/spinner";
import { ErrorMessage } from "./layout/errormessage";

const getColorForHttpMethod = (method) => {
  const methodColors = {
    GET: "#28a745", // Green for GET requests
    POST: "#007bff", // Blue for POST requests
    PUT: "#ffc107", // Yellow for PUT requests
    DELETE: "#dc3545", // Red for DELETE requests
    PATCH: "#17a2b8", // Teal for PATCH requests
    OPTIONS: "#6c757d", // Gray for OPTIONS requests
    HEAD: "#343a40", // Dark gray for HEAD requests
  };

  // Return the color for the method, or a default color if not found
  return methodColors[method.toUpperCase()] || "#6c757d"; // Default: gray
};

export const ProjectFolders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
    isError: projectsIsError,
  } = useGetProjects();
  const {
    data: urlsUnderProjects,
    isLoading: urlsLoading,
    isError: isUrlsError,
    error: urlsError,
  } = useGetProjectUrls({
    project: selectedProject,
  });
  const { mutate: deleteMutateProjetc } = useDeleteProject();

  const onDelete = (id: string) => {
    //@ts-ignore
    deleteMutateProjetc({ id });
  };

  if (projectsIsError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorMessage
          message={(projectsError as any)?.response?.data?.message}
        />
      </div>
    );
  }

  if (projectsLoading)
    return (
      <div className="flex justify-center items-center">
        <Spinner size={"sm"} className="bg-black" />
      </div>
    );

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <p className="text-sm">Projects</p>
        <Button variant={"ghost"} className="p-0">
          <Link to="project?action=ADD">
            <PlusSquare />
          </Link>
        </Button>
      </SidebarGroupLabel>
      <div className="px-3 py-2">
        <SidebarInput
          type="search"
          placeholder="Search Project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 w-full"
        />
      </div>
      <SidebarMenu>
        {projects?.data
          ?.filter((project) => {
            if (searchTerm === "") return true;

            return project.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          })
          ?.map((project) => (
            <>
              <Collapsible
                key={project._id}
                asChild
                open={selectedProject === project._id}
                onOpenChange={() => {
                  setSelectedProject((p) =>
                    project._id === p ? "" : project._id
                  );
                }}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <div className="flex">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={project.name}>
                        {<Folder />}
                        <span className="capitalize font-medium">
                          {project.name}
                        </span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger className="flex items-center pr-[7px]">
                        <EllipsisVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <Link to={`project?action=UPDATE&id=${project._id}`}>
                          <DropdownMenuItem>
                            <Edit2 />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => onDelete(project._id)}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {isUrlsError ? (
                    <ErrorMessage
                      message={(urlsError as any)?.response?.data?.message}
                    />
                  ) : urlsLoading ? (
                    <div className="flex justify-center items-center">
                      <Spinner size={"sm"} className="bg-black" />
                    </div>
                  ) : (
                    urlsUnderProjects?.data?.map((subItem) => (
                      <CollapsibleContent
                        key={subItem._id}
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                      >
                        <SidebarMenuSub>
                          <SidebarMenuSubItem
                            key={subItem._id}
                            className="flex items-center"
                          >
                            <p
                              className=" font-medium text-xs"
                              style={{
                                color: getColorForHttpMethod(subItem.method),
                              }}
                            >
                              {subItem.method}
                            </p>

                            <SidebarMenuSubButton>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Link
                                      to={`url/${subItem._id}`}
                                      className="truncate"
                                    >
                                      {subItem.name}
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{subItem.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ))
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
