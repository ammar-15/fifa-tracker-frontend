import SidebarLayout from "../components/SidebarLayout";
import AddButton from "@/components/addbutton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }
    , [navigate]);
  return (
    <SidebarLayout>
      <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-lg">This is your dashboard content.</p>
      <div className="fixed bottom-10 right-12">
        <AddButton />
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
