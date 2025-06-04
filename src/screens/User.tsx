import SidebarLayout from '../components/SidebarLayout';
import UserProfile from "@/components/userprofile";

const User = () => {
  return (
    <SidebarLayout>
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
      <UserProfile />
    </div>
    </SidebarLayout>
  );
};


export default User;