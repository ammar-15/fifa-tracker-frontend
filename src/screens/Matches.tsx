import SidebarLayout from "@/components/SidebarLayout";
import AddButton from "@/components/addbutton";
import MatchTable from "@/components/match-table";

const Matches = () => {
  return (
    <SidebarLayout>
      <h1 className="text-4xl font-bold mb-4">Matches</h1>
      <div className="mt-5">
        <MatchTable></MatchTable>
      </div>
      <div className="fixed bottom-10 right-12 z-50">
        <AddButton />
      </div>
    </SidebarLayout>
  );
};
export default Matches;
