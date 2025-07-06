import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface FriendRequest {
  from: string;
  to: string;
  username: string;
  email: string;
}

export default function FriendRequestsTable() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
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

  useEffect(() => {
    const fetchRequests = async () => {
      if (!username) return;
      try {
        const res = await fetch(`http://localhost:5050/friends?username=${username}`);
        const data = await res.json();
        console.log("Friend requests fetched:", data.requests);
        setRequests(data.requests);
      } catch (error) {
        toast.error("Failed to load friend requests");
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchRequests();
  }, [username]);

  const handleAccept = async (email: string) => {
    if (!username) return;
    try {
      await fetch("http://localhost:5050/friends/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      toast.success("Friend request accepted");
      setRequests((prev) => prev.filter((req) => req.email !== email));
    } catch (error) {
      toast.error("Error accepting request");
      console.error(error);
    }
  };

  const handleReject = async (email: string) => {
    if (!username) return;
    try {
      await fetch("http://localhost:5050/friends/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      toast("Friend request rejected");
      setRequests((prev) => prev.filter((req) => req.email !== email));
    } catch (error) {
      toast.error("Error rejecting request");
      console.error(error);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mt-10 mb-2">Friend Requests</h2>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">No pending friend requests.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={`${req.from}-${req.to}`}>
                <TableCell>{req.username}</TableCell>
                <TableCell>{req.email}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="default" onClick={() => handleAccept(req.email)}>
                    Accept
                  </Button>
                  <Button variant="destructive" onClick={() => handleReject(req.email)}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
