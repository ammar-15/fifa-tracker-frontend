import SidebarLayout from "../components/SidebarLayout";
import AddButton from "@/components/addbutton";

const Analytics = () => {
  return (
    <SidebarLayout>
      <h1 className="text-4xl font-bold mb-4">Analytics</h1>
      <p className="text-lg">Analytics page content goes here.</p>
      <div className="fixed bottom-10 right-12 z-50">
        <AddButton />
      </div>
    </SidebarLayout>
  );
};
export default Analytics;
