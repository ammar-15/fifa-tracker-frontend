import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import BinIcon from "@/assets/bin.svg";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { apiFetch } from "@/lib/api";

interface User {
  username: string;
  email: string;
}

interface FriendsTableProps {
  friends: User[];
  refreshFriends: () => void;
  username: string | null;
}

export default function FriendsTable({
  friends,
  refreshFriends,
  username,
}: FriendsTableProps) {
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

  const deleteFriend = async (friendEmail: string) => {
    if (!username) {
      toast.error("Unable to identify current user");
      return;
    }

    try {
      const res = await apiFetch(`/friends/remove`, {
        method: "POST",
        body: { username, email: friendEmail },
      });

      if (!res.ok) throw new Error("Failed to remove friend");

      toast.success("Friend removed");
      refreshFriends();
    } catch {
      toast.error("Could not remove friend");
    }
  };

  return (
    <>
      <h2 className="mb-2 mt-10 text-2xl font-semibold">Your Friends</h2>
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
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <img
                      src={BinIcon}
                      alt="Delete"
                      className="ml-auto h-5 w-5 cursor-pointer rounded transition hover:bg-gray-200"
                      onClick={() => setSelectedFriend(friend)}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Remove {selectedFriend?.username} from your friends?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          selectedFriend && deleteFriend(selectedFriend.email)
                        }
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
