import * as React from "react";
import { Globe, TowerControl } from "lucide-react";
import { ProjectFolders } from "@/components/project-folders";
import { UtilityOptions } from "@/components/utility-options";
// import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team";
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Watcher",
      logo: TowerControl,
      plan: "URLs are Online or Not.",
    },
  ],

  options: [
    {
      name: "Add URL",
      url: "/add/url",
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
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
