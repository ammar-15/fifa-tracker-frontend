import { useState } from "react";
import MatchesTable from "./MatchesTable";
import AnalyticsFilter from "./AnalyticsFilter";
import StatsChart from "./StatsChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRightIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";

const allStats = [
  "Overall Stats",
  "Goals",
  "Possession",
  "Shots",
  "Expected Goals",
  "Passes",
  "Tackles",
  "Tackles Won",
  "Interceptions",
  "Saves",
  "Fouls Committed",
  "Offsides",
  "Corners",
  "Free Kicks",
  "Penalty Kicks",
  "Yellow Cards",
  "Red Cards",
];

interface AuthMeResponse {
  user?: {
    username?: string;
  };
}

export default function AnalyticsGrouped() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [matchData, setMatchData] = useState([]);
  const [statData, setStatData] = useState<Record<string, any> | null>(null);
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const [overallStatData, setOverallStatData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[] }[];
  } | null>(null);

  const handleFetchAnalytics = async () => {
    if (!selectedFriend || !dateRange.start || !dateRange.end) {
      return;
    }

    let username = "";

    try {
      const meRes = await apiFetch("/auth/me", { method: "GET" });
      if (!meRes.ok) {
        return;
      }

      const meData = (await meRes.json()) as AuthMeResponse;
      username = meData.user?.username ?? "";

      if (!username) {
        return;
      }
    } catch (err) {
      console.error("Failed to resolve current user:", err);
      return;
    }

    const query = `friend=${encodeURIComponent(selectedFriend)}&username=${encodeURIComponent(username)}&start=${encodeURIComponent(
      dateRange.start.toISOString()
    )}&end=${encodeURIComponent(dateRange.end.toISOString())}`;

    try {
      const [matchesRes, statsRes, overallRes] = await Promise.all([
        apiFetch(`/api/analyticmatches?${query}`),
        apiFetch(`/api/stats?${query}`),
        apiFetch(`/api/overallstats?${query}`),
      ]);

      if (!matchesRes.ok)
        console.error("matchesRes error:", await matchesRes.text());
      if (!statsRes.ok) console.error("statsRes error:", await statsRes.text());
      if (!overallRes.ok)
        console.error("overallRes error:", await overallRes.text());

      const [matches, stats, overall] = await Promise.all([
        matchesRes.json(),
        statsRes.json(),
        overallRes.json(),
      ]);

      setMatchData(matches);
      setStatData(stats);
      setOverallStatData({
        labels: (overall as { labels: string[] }).labels,
        datasets: (overall as { datasets: { label: string; data: number[] }[] })
          .datasets,
      });
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    }
  };

  return (
    <>
      <Dialog open={!!expandedStat} onOpenChange={() => setExpandedStat(null)}>
        <DialogContent className="max-w-4xl p-6">
          {expandedStat && (
            <div>
              <h2 className="mb-4 text-2xl font-bold">{expandedStat} per Match</h2>
              <StatsChart
                stat={expandedStat}
                data={
                  expandedStat === "Overall Stats"
                    ? overallStatData
                    : statData?.[expandedStat]
                }
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-4">
          <AnalyticsFilter
            onSelect={setSelectedFriend}
            onRangeChange={setDateRange}
          />
          <Button onClick={() => void handleFetchAnalytics()}>Apply</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="px-2 py-1">
            <CardContent className="px-2 py-1">
              <MatchesTable matches={matchData} />
            </CardContent>
          </Card>

          {allStats.map((stat) => (
            <Card
              key={stat}
              className="cursor-pointer px-2 pt-1 transition hover:shadow-md"
              onClick={() => setExpandedStat(stat)}
            >
              <CardContent className="flex h-full flex-col p-4 px-2">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{stat} per Match</h2>
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <StatsChart
                  stat={stat}
                  data={
                    stat === "Overall Stats"
                      ? overallStatData
                      : statData?.[stat]
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
