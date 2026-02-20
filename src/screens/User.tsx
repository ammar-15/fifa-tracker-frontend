import SidebarLayout from '../components/SidebarLayout';
import UserProfile from "@/components/userprofile";

const User = () => {
  return (
    <SidebarLayout>
    <div className="">
      <h1 className="text-4xl font-bold mb-4">User Profile</h1>
       <div className=''>
      <UserProfile />
      </div>
    </div>
    </SidebarLayout>
  );
};


export default User;