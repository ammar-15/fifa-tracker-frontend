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
import { toast } from "sonner";

interface FriendRequest {
  from: string;
  to: string;
  username: string;
  email: string;
}
interface FriendRequestsTableProps {
  username: string | null;
  refreshFriends: () => void;
}

export default function FriendRequestsTable({ username, refreshFriends }: FriendRequestsTableProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!username) return;
      try {
        const res = await fetch(`http://localhost:5050/friends?username=${username}`);
        const data = await res.json();
        setRequests(data.requests);
      } catch (error) {
        toast.error("Failed to load friend requests");
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
      refreshFriends();
    } catch (error) {
      toast.error("Error accepting request");
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
