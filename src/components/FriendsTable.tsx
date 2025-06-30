import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface User {
  username: string;
  email: string;
}

interface FriendsTableProps {
  friends: User[];
}

export default function FriendsTable({ friends }: FriendsTableProps) {
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
