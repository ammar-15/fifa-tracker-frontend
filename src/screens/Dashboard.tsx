import SidebarLayout from "../components/SidebarLayout";
import AddButton from "@/components/addbutton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, navigate, user]);

  return (
    <SidebarLayout>
      <h1 className="mb-4 text-4xl font-bold">Welcome to the Dashboard</h1>
      <p className="mt-6 text-lg">This is your dashboard content.</p>
      <div className="fixed bottom-10 right-12">
        <AddButton onSaveSuccess={() => undefined} />
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
