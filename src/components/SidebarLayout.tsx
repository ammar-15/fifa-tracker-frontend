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
import { googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  exp: number;
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let username = "";

  if (token && token !== "undefined") {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      username = decoded.username;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("token");
    navigate("/");
  };

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined") return;

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userEmail = decoded.email;

        const res = await fetch(
          `http://localhost:5050/userprofile?email=${userEmail}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to get profile photo");

        const data = await res.json();
        setProfileImage(data.user.profilePhoto || null);
        console.log("Sidebar profile image:", data.user.profilePhoto);
      } catch (err) {
        console.error("Error getting profile image:", err);
        setProfileImage(null);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen">
        <Sidebar side="left" collapsible="icon">
          {" "}
          <SidebarContent>
            <div className="flex items-center m-2 justify-between gap-2">
              <div className="text-xl ml-1 group-data-[collapsible=icon]:hidden">
                Goalzy
              </div>
              <SidebarTrigger className="my-2 h-5 w-5" />
            </div>
            <SidebarHeader
              onClick={() => navigate("/user")}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                    {username}
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
              <SidebarMenuItem
                onClick={handleLogout}
                className="cursor-pointer flex flex-row gap-2 items-center bottom-5"
              >
                <LogOutIcon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {" "}
                  Logout
                </span>
              </SidebarMenuItem>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="p-6 overflow-auto">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
