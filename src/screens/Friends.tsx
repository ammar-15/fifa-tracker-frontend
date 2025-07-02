import SidebarLayout from "@/components/SidebarLayout";
import AddFriendSearch from "@/components/add-friend-search";
import FriendsTable from "@/components/FriendsTable";
import FriendRequestsTable from "@/components/FriendRequestsTable";
import { useEffect, useState } from "react";

interface FriendRequest {
  from: string;
  to: string;
  username: string;
  email: string;
}

interface User {
  username: string;
  email: string;
}


export default function Friends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername !== "undefined") {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!username) return;
      try {
        const res = await fetch(
          `http://localhost:5050/friends?username=${username}`
        );
        const data = await res.json();
        setFriends(data.friends);
        setRequests(data.requests);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, [username]);

  const handleAccept = async (email: string) => {
    await fetch("http://localhost:5050/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    });
    location.reload();
  };

  const handleReject = async (email: string) => {
    await fetch("http://localhost:5050/friends/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    });
    location.reload();
  };

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Friends</h1>
        <div className="flex items-start gap-10 w-full max-w-7xl justify-between mb-4">
          <div className="mb-30 flex-1">
            <FriendsTable friends={friends} />
          </div>
          <div className="w-100 flex-1 mt-15">
            <AddFriendSearch />
          </div>
        </div>

        <FriendRequestsTable
          requests={requests}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>
    </SidebarLayout>
  );
}
