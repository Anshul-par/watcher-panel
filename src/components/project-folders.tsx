import {
  Edit2,
  EllipsisVertical,
  Folder,
  PlusSquare,
  Sparkle,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
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
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects } = useGetProjects();
  const { data: urlsUnderProjects } = useGetProjectUrls({
    project: selectedProject,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <p className="text-sm">Projects</p>
        <Button variant={"ghost"} className="p-0">
          <Link to="/project?action=ADD">
            <PlusSquare />
          </Link>
        </Button>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects?.data?.map((project) => (
          <Collapsible
            key={project._id}
            asChild
            open={selectedProject === project._id}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                setSelectedProject(project._id);
              }
            }}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={project.name}>
                  {<Folder />}
                  <span className="capitalize font-medium">{project.name}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {urlsUnderProjects?.data?.map((subItem) => (
                <CollapsibleContent key={subItem._id}>
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
                                to={`/url/${subItem._id}`}
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
              ))}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
