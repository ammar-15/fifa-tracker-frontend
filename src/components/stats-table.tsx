import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ParsedStat {
  stat: string;
  left: string;
  right: string;
}

interface ParsedResult {
  username: string;
  oppUsername: string;
  team1: string;
  team1Goals: string;
  team2: string;
  team2Goals: string;
  timePlayed: string;
  stats: ParsedStat[];
}

interface StatsTableProps {
  setOpen: (value: boolean) => void;
  loggedInUsername: string;
}

const statsList = [
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

export default function StatsTable({ loggedInUsername }: StatsTableProps) {
  const [formData, setFormData] = useState<ParsedResult | null>(null);
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedRes = await fetch("http://localhost:5050/parsed");
        const parsedJson = await parsedRes.json();
        const parsed = parsedJson.data as ParsedResult;

        if (parsedJson.uniqueid) {
          localStorage.setItem("uniqueid", parsedJson.uniqueid);
        }

        const completeStats = statsList.map((stat) => {
          const match = parsed.stats.find((s) => s.stat === stat);
          return match || { stat, left: "", right: "" };
        });

        setFormData({
          ...parsed,
          stats: completeStats,
          username: loggedInUsername,
        });
      } catch (err) {
        console.error("Error fetching parsed data:", err);
      }

      try {
        const friendsRes = await fetch("http://localhost:5050/friendusernames");
        const friendsJson = await friendsRes.json();
        if (Array.isArray(friendsJson)) {
          setFriends(friendsJson);
        } else {
          console.warn("Unexpected friends API response:", friendsJson);
        }
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchData();
  }, [loggedInUsername]);

  const handleFieldChange = (field: keyof ParsedResult, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleStatChange = (
    statName: string,
    side: "left" | "right",
    value: string
  ) => {
    if (formData) {
      const updatedStats = formData.stats.map((s) =>
        s.stat === statName ? { ...s, [side]: value } : s
      );
      setFormData({ ...formData, stats: updatedStats });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    const uniqueid = localStorage.getItem("uniqueid");
    if (!uniqueid) {
      console.error("Unique ID not found in localStorage");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/savedata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, uniqueid }),
      });

      const responseJson = await res.json();
      console.log("Save response:", responseJson);
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data");
    }
  };

  if (!formData) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-4 flex flex-col md:flex-row gap-8">
      <div className="flex flex-col gap-4 w-full md:w-3/3">
        <div className="flex gap-4">
          <Input
            placeholder="Username (Team 1)"
            value={formData.username}
            onChange={(e) => handleFieldChange("username", e.target.value)}
            className="flex-1"
          />
          <select
            value={formData.oppUsername}
            onChange={(e) => handleFieldChange("oppUsername", e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-sm"
          >
            <option value="">Select Opponent</option>
            <option value="akuul15">akuul15</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Team Name 1"
            value={formData.team1}
            onChange={(e) => handleFieldChange("team1", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Team Name 2"
            value={formData.team2}
            onChange={(e) => handleFieldChange("team2", e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Goals Team 1"
            value={formData.team1Goals}
            onChange={(e) => handleFieldChange("team1Goals", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Goals Team 2"
            value={formData.team2Goals}
            onChange={(e) => handleFieldChange("team2Goals", e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex justify-center">
          <Input
            placeholder="Time Played"
            value={formData.timePlayed}
            onChange={(e) => handleFieldChange("timePlayed", e.target.value)}
            className="w-40 text-center"
          />
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <Table className="w-full">
          <TableBody>
            {statsList.map((stat, i) => {
              const matched = formData.stats.find((s) => s.stat === stat);
              return (
                <TableRow key={i} className="h-10">
                  <TableCell className="text-center w-1/4 p-1">
                    <Input
                      placeholder="-"
                      value={matched?.left ?? ""}
                      onChange={(e) =>
                        handleStatChange(stat, "left", e.target.value)
                      }
                      className="w-16 h-7 text-center mx-auto"
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium w-1/2 p-1 text-sm">
                    {stat}
                  </TableCell>
                  <TableCell className="text-center w-1/4 p-1">
                    <Input
                      placeholder="-"
                      value={matched?.right ?? ""}
                      onChange={(e) =>
                        handleStatChange(stat, "right", e.target.value)
                      }
                      className="w-16 h-7 text-center mx-auto"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            className="bg-black text-white hover:bg-black/80"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
