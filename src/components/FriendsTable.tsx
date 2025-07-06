import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface User {
  username: string;
  email: string;
}

export default function FriendsTable() {
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
    fetchFriends();
  }, [username]);

  return (
    <>
      <h2 className="text-2xl font-semibold mt-10 mb-2">Your Friends</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {friends.map((friend) => (
            <TableRow key={friend.email}>
              <TableCell>{friend.username}</TableCell>
              <TableCell>{friend.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
