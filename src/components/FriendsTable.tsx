import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
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

interface User {
  username: string;
  email: string;
}

interface FriendsTableProps {
  friends: User[];
  refreshFriends: () => void;
}

export default function FriendsTable({ friends, refreshFriends }: FriendsTableProps) {
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

  const deleteFriend = async (friendEmail: string) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode<{ username: string }>(token!);
      const username = decoded.username;

      const res = await fetch(`http://localhost:5050/friends/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email: friendEmail }),
      });

      if (!res.ok) throw new Error("Failed to remove friend");

      toast.success("Friend removed");
      refreshFriends();
    } catch (err) {
      toast.error("Could not remove friend");
    }
  };

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
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <img
                      src={BinIcon}
                      alt="Delete"
                      className="w-5 h-5 cursor-pointer ml-auto rounded hover:bg-gray-200 transition"
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
