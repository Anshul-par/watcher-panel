import { Navigate, Outlet } from "react-router-dom"

import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../app-sidebar"

export const Layout = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/" />
  }

  return (
    <SidebarProvider>
      <AppSidebar className="h-screen" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:hidden">
          <div className="flex items-center gap-2 px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
