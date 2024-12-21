import * as React from "react";
import { Globe } from "lucide-react";
import { ProjectFolders } from "@/components/project-folders";
import { UtilityOptions } from "@/components/utility-options";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  options: [
    {
      name: "Add URL",
      url: "add/url",
      icon: Globe,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <ProjectFolders />
        <UtilityOptions utilities={data.options} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
