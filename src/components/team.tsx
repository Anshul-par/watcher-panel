import {
  ChevronsUpDown,
  Crown,
  Edit2,
  Plus,
  TowerControl,
  Trash2,
  WandSparkles,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import customAxios from "@/api";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { UserForm } from "./user-form";
import { useState } from "react";
import { useDeleteUser } from "@/data/mutation/useDeleteUser";

const queryConfig = {
  queryKey: ["users"],
  queryFn: async () => {
    const { data } = await customAxios.get("/user");
    return data;
  },
};

export const TeamSwitcher = () => {
  const { data, isLoading } = useQuery(queryConfig);
  const { mutate: deleteMutateUser } = useDeleteUser();
  const [modalState, setModalState] = useState<{
    action: "ADD" | "UPDATE";
    values: Record<string, any>;
    id: string;
    isOpen: boolean;
  }>({
    action: "ADD",
    values: {
      name: "",
      slackUserId: "",
      title: "",
    },
    id: "",
    isOpen: false,
  });

  const onDelete = (id) => {
    //@ts-ignore
    deleteMutateUser({ id });
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TowerControl className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Watcher</span>
                  <span className="truncate text-xs">
                    URLs are Online or Not
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={"right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Team
              </DropdownMenuLabel>
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Spinner size={"sm"} className="bg-black dark:bg-white" />
                </div>
              ) : (
                <>
                  {data?.data?.map((team, i) => (
                    <DropdownMenuItem
                      key={i}
                      className="flex justify-center items-center gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        {team.title === "Boss" ? (
                          <Crown className="size-4 shrink-0" />
                        ) : (
                          <WandSparkles className="size-4 shrink-0" />
                        )}
                      </div>
                      <p>{team.name}</p>
                      {team.title && (
                        <p className="font-semibold">({team.title})</p>
                      )}
                      <DropdownMenuShortcut className="flex gap-2">
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className="p-2"
                          onClick={() =>
                            setModalState({
                              ...modalState,
                              isOpen: true,
                              action: "UPDATE",
                              id: team._id,
                              values: {
                                name: team.name,
                                slackUserId: team.slackUserId,
                                title: team.title,
                              },
                            })
                          }
                        >
                          <Edit2 className="h-1 w-1" />
                        </Button>
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className="p-2"
                          onClick={() => onDelete(team._id)}
                        >
                          <Trash2 className="h-1 w-1" color="red" />
                        </Button>
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div
                  className="font-medium text-muted-foreground"
                  onClick={() => setModalState({ ...modalState, isOpen: true })}
                >
                  Add User
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <UserForm
        action={modalState.action}
        id={modalState.id}
        isOpen={modalState.isOpen}
        //@ts-ignore
        values={modalState.values}
        //@ts-ignore
        setIsOpen={setModalState}
      />
    </>
  );
};
