import SidebarLayout from "@/components/SidebarLayout";
import AddFriendSearch from "@/components/add-friend-search";
import FriendsTable from "@/components/FriendsTable";
import FriendRequestsTable from "@/components/FriendRequestsTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface User {
  username: string;
  email: string;
}

interface AuthMeResponse {
  user?: {
    username?: string;
  };
}

export default function Friends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const res = await apiFetch("/auth/me", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as AuthMeResponse;
        setUsername(data.user?.username ?? null);
      } catch {
        setUsername(null);
      }
    };

    void loadUsername();
  }, []);

  const fetchFriends = async () => {
    if (!username) return;
    try {
      const res = await apiFetch(`/friends?username=${encodeURIComponent(username)}`);
      const data = (await res.json()) as { friends?: User[] };
      setFriends(data.friends ?? []);
    } catch {
      toast.error("Failed to fetch friends");
    }
  };

  useEffect(() => {
    if (username) {
      void fetchFriends();
    }
  }, [username]);

  return (
    <SidebarLayout>
      <div className="mx-auto w-full max-w-7xl px-4">
        <h1 className="mb-4 text-4xl font-bold">Friends</h1>
        <div className="mb-4 flex w-full max-w-7xl items-start justify-between gap-10">
          <div className="mb-30 flex-1">
            <FriendsTable friends={friends} refreshFriends={fetchFriends} username={username} />
          </div>
          <div className="mt-15 w-100 flex-1">
            <AddFriendSearch fromUsername={username} />
          </div>
        </div>
        <FriendRequestsTable username={username} refreshFriends={fetchFriends} />
      </div>
    </SidebarLayout>
  );
}
