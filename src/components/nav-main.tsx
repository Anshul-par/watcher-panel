"use client";

import { Folder, type LucideIcon } from "lucide-react";

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
import { Badge } from "./ui/badge";

export const NavMain = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) => {
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects } = useGetProjects();
  const { data: urlsUnderProjects } = useGetProjectUrls({
    project: selectedProject,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Project</SidebarGroupLabel>
      <SidebarMenu>
        {projects?.data?.map((project, i) => (
          <Collapsible
            key={project._id}
            asChild
            onOpenChange={(isOpen) => {
              if (isOpen) {
                setSelectedProject(project._id);
              }
            }}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={items[i].title}>
                  {<Folder />}
                  <span className="capitalize font-medium">{project.name}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {urlsUnderProjects?.data?.map((subItem) => (
                    <SidebarMenuSubItem
                      key={subItem._id}
                      className="flex items-center"
                    >
                      <p className="text-green-600 font-medium text-xs">
                        {subItem.method}
                      </p>
                      <SidebarMenuSubButton>
                        {subItem.url.slice(0, 12)}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
