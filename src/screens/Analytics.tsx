import SidebarLayout from "../components/SidebarLayout";
import AnalyticsGrouped from "../components/analytics/AnalyticsGrouped";

export default function Analytics() {
  return (
    <SidebarLayout>
      <div className="w-100% px-4">
        <h1 className="text-4xl font-bold mb-4">Analytics</h1>
        <AnalyticsGrouped />
      </div>
    </SidebarLayout>
  );
}
