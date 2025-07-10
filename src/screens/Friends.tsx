import SidebarLayout from "@/components/SidebarLayout";
import AddFriendSearch from "@/components/add-friend-search";
import FriendsTable from "@/components/FriendsTable";
import FriendRequestsTable from "@/components/FriendRequestsTable";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface User {
  username: string;
  email: string;
}

export default function Friends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      try {
        const decoded = jwtDecode<{ username: string }>(token);
        setUsername(decoded.username);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchFriends = async () => {
    if (!username) return;
    try {
      const res = await fetch(`http://localhost:5050/friends?username=${username}`);
      const data = await res.json();
      setFriends(data.friends);
    } catch (error) {
      toast.error("Failed to fetch friends");
    }
  };

  useEffect(() => {
    if (username) fetchFriends();
  }, [username]);

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Friends</h1>
        <div className="flex items-start gap-10 w-full max-w-7xl justify-between mb-4">
          <div className="mb-30 flex-1">
            <FriendsTable friends={friends} refreshFriends={fetchFriends} />
          </div>
          <div className="w-100 flex-1 mt-15">
            <AddFriendSearch />
          </div>
        </div>
        <FriendRequestsTable username={username} refreshFriends={fetchFriends} />
      </div>
    </SidebarLayout>
  );
}
