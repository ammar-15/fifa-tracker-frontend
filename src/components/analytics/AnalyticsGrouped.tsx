import { useState } from "react";
import MatchesTable from "./MatchesTable";
import AnalyticsFilter from "./AnalyticsFilter";
import StatsChart from "./StatsChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRightIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";

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

export default function AnalyticsGrouped() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [matchData, setMatchData] = useState([]);
  const [statData, setStatData] = useState<any>(null);
  console.log("statData:", statData);
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const [overallStatData, setOverallStatData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[] }[];
  } | null>(null);

  const handleFetchAnalytics = async () => {
    if (!selectedFriend || !dateRange.start || !dateRange.end) {
      console.log("Missing inputs:", {
        selectedFriend,
        start: dateRange.start,
        end: dateRange.end,
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      console.error("Token not found in localStorage");
      return;
    }

    let decoded: { username: string };
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode token:", err);
      return;
    }

    const username = decoded.username;
    const query = `friend=${selectedFriend}&username=${username}&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`;
    console.log("Query string:", query);

    try {
      const baseURL = "http://localhost:5050/api";

      const [matchesRes, statsRes, overallRes] = await Promise.all([
        fetch(`${baseURL}/analyticmatches?${query}`),
        fetch(`${baseURL}/stats?${query}`),
        fetch(`${baseURL}/overallstats?${query}`),
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

      console.log("Data received:", { matches, stats, overall });

      setMatchData(matches);
      setStatData(stats);
      setOverallStatData({
        labels: overall.labels,
        datasets: overall.datasets,
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
              <h2 className="text-2xl font-bold mb-4">
                {expandedStat} per Match
              </h2>
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

      <div className="gap-5 flex flex-col">
        <div className="flex flex-wrap items-center gap-4">
          <AnalyticsFilter
            onSelect={setSelectedFriend}
            onRangeChange={setDateRange}
          />
          <Button
            onClick={() => {
              console.log("Apply clicked");
              handleFetchAnalytics();
            }}
          >
            Apply
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="px-2 py-1">
            <CardContent className="px-2 py-1">
              <MatchesTable matches={matchData} />
            </CardContent>
          </Card>

          {allStats.map((stat) => (
            <Card
              key={stat}
              className="cursor-pointer transition hover:shadow-md px-2 pt-1"
              onClick={() => setExpandedStat(stat)}
            >
              <CardContent className="p-4 flex flex-col h-full px-2">
                <div className="flex justify-between items-center mb-2">
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
                />{" "}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
