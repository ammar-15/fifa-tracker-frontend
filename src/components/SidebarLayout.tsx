import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar-menu";
import { useNavigate } from "react-router-dom";
import {
  LogOutIcon,
  HomeIcon,
  GlobeIcon,
  UsersIcon,
  UserIcon,
} from "lucide-react";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar side="left" collapsible="icon">
          {" "}
          <SidebarContent>
            <div className="flex items-center m-2 justify-between gap-2">
              <div className="text-xl ml-1 group-data-[collapsible=icon]:hidden">Goalzy</div>
              <SidebarTrigger className="my-2 h-5 w-5" />
              
            </div>
            <SidebarHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                    UserName
                  </span>
                </div>
              </div>
            </SidebarHeader>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/dashboard")}>
                  <HomeIcon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Dashboard
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/matches")}>
                  <GlobeIcon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Matches
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/analytics")}>
                  <UserIcon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Analytics
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/friends")}>
                  <UsersIcon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Friends
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarFooter className="mt-auto">
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/logout")}>
                  <LogOutIcon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Logout
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="p-6 overflow-auto">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
