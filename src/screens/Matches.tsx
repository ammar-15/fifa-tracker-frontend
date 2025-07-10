import SidebarLayout from "@/components/SidebarLayout";
import AddButton from "@/components/addbutton";
import MatchTable from "@/components/match-table";
import { useState } from "react";

const Matches = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <SidebarLayout>
      <h1 className="text-4xl font-bold mb-4">Matches</h1>
      <div className="mt-5">
        <MatchTable key={refreshTrigger} />
      </div>
      <div className="fixed bottom-10 right-12 z-50">
        <AddButton onSaveSuccess={() => setRefreshTrigger(prev => prev + 1)} />
      </div>
    </SidebarLayout>
  );
};
export default Matches;
