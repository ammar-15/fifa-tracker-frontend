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
import { apiFetch } from "@/lib/api";

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

export default function FriendRequestsTable({
  username,
  refreshFriends,
}: FriendRequestsTableProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!username) return;
      try {
        const res = await apiFetch(`/friends?username=${encodeURIComponent(username)}`);
        const data = (await res.json()) as { requests?: FriendRequest[] };
        setRequests(data.requests ?? []);
      } catch {
        toast.error("Failed to load friend requests");
      }
    };

    void fetchRequests();
  }, [username]);

  const handleAccept = async (email: string) => {
    if (!username) return;
    try {
      await apiFetch("/friends/accept", {
        method: "POST",
        body: { username, email },
      });
      toast.success("Friend request accepted");
      setRequests((prev) => prev.filter((req) => req.email !== email));
      refreshFriends();
    } catch {
      toast.error("Error accepting request");
    }
  };

  const handleReject = async (email: string) => {
    if (!username) return;
    try {
      await apiFetch("/friends/reject", {
        method: "POST",
        body: { username, email },
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
      <h2 className="mb-2 mt-10 text-2xl font-semibold">Friend Requests</h2>

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
                  <Button variant="default" onClick={() => void handleAccept(req.email)}>
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => void handleReject(req.email)}
                  >
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
