import SidebarLayout from "@/components/SidebarLayout";
import AddFriendSearch from "@/components/add-friend-search";
import FriendsTable from "@/components/FriendsTable";
import FriendRequestsTable from "@/components/FriendRequestsTable";

export default function Friends() {

  return (
    <SidebarLayout>
      <div className="w-full max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Friends</h1>
        <div className="flex items-start gap-10 w-full max-w-7xl justify-between mb-4">
          <div className="mb-30 flex-1">
            <FriendsTable />
          </div>
          <div className="w-100 flex-1 mt-15">
            <AddFriendSearch />
          </div>
        </div>
        <FriendRequestsTable />
      </div>
    </SidebarLayout>
  );
}
