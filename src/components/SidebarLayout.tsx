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
import { LogOutIcon, HomeIcon, UsersIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import GoalIcon from "../assets/goal.svg";
import { useAuth } from "@/auth/useAuth";
import { apiFetch } from "@/lib/api";
import { resolveProfilePhotoUrl } from "@/lib/profile-photo";

interface AuthMeResponse {
  user?: {
    username?: string;
    email?: string;
  };
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, navigate, user]);

  useEffect(() => {
    if (!user) {
      setDisplayName("");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await apiFetch("/auth/me", { method: "GET" });
        if (!res.ok) {
          setDisplayName(user.email ?? "");
          return;
        }
        const data = (await res.json()) as AuthMeResponse;
        setDisplayName(data.user?.username ?? user.email ?? "");
      } catch {
        setDisplayName(user.email ?? "");
      }
    };

    void fetchCurrentUser();
  }, [user]);

  useEffect(() => {
    if (!user?.email) {
      setProfileImage(null);
      return;
    }

    const fetchProfileImage = async () => {
      try {
        const res = await apiFetch(
          `/userprofile?email=${encodeURIComponent(user.email ?? "")}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) throw new Error("Failed to get profile photo");

        const data = (await res.json()) as {
          user?: { profilePhoto?: string | null };
        };
        setProfileImage(data.user?.profilePhoto ?? null);
      } catch (err) {
        console.error("Error getting profile image:", err);
        setProfileImage(null);
      }
    };

    void fetchProfileImage();
  }, [user?.email]);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <Sidebar side="left" collapsible="icon">
          <SidebarContent>
            <div className="m-2 flex items-center justify-between gap-2">
              <div className="ml-1 text-xl group-data-[collapsible=icon]:hidden">
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
                  <img
                    src={resolveProfilePhotoUrl(profileImage)}
                    alt="Profile"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                    {displayName}
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
                  <img src={GoalIcon} alt="Goal" className="h-4 w-4" />
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
                onClick={() => void logout()}
                className="bottom-5 flex cursor-pointer flex-row items-center gap-2"
              >
                <LogOutIcon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </SidebarMenuItem>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="w-full p-6">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
