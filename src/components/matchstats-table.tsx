import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ParsedStat {
  stat: string;
  left: string;
  right: string;
}

interface Match {
  uniqueid: string;
  username: string;
  oppUsername: string;
  team1: string;
  team1Goals: string;
  team2: string;
  team2Goals: string;
  timePlayed: string;
  stats: ParsedStat[];
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

export default function MatchStatsTable({
  match,
  onClose,
}: {
  match: Match;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Match>(() => {
    const filledStats = statsList.map((stat) => {
      const existing = match.stats.find((s) => s.stat === stat);
      return existing || { stat, left: "", right: "" };
    });
    return { ...match, stats: filledStats };
  });

  const handleFieldChange = (field: keyof Match, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStatChange = (
    statName: string,
    side: "left" | "right",
    value: string
  ) => {
    const updatedStats = formData.stats.map((s) =>
      s.stat === statName ? { ...s, [side]: value } : s
    );
    setFormData({ ...formData, stats: updatedStats });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://localhost:5050/matchdata/updatedata",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uniqueid: formData.uniqueid,
            stats: formData.stats,
            username: formData.username,
            oppUsername: formData.oppUsername,
            team1: formData.team1,
            team1Goals: formData.team1Goals,
            team2: formData.team2,
            team2Goals: formData.team2Goals,
            timePlayed: formData.timePlayed,
          }),
        }
      );

      const data = await response.json();
      console.log("Save response:", data);
      onClose();
    } catch (error) {
      console.error("Failed to save stats:", error);
    }
  };

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
          <Input
            placeholder="Opponent Username"
            value={formData.oppUsername}
            onChange={(e) => handleFieldChange("oppUsername", e.target.value)}
            className="flex-1"
          />
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
            {formData.stats.map((stat, index) => (
              <TableRow key={index} className="h-10">
                <TableCell className="text-center w-1/4 p-1">
                  <Input
                    placeholder="-"
                    value={stat.left}
                    onChange={(e) =>
                      handleStatChange(stat.stat, "left", e.target.value)
                    }
                    className="w-16 h-7 text-center mx-auto"
                  />
                </TableCell>
                <TableCell className="text-center font-medium w-1/2 p-1 text-sm">
                  {stat.stat}
                </TableCell>
                <TableCell className="text-center w-1/4 p-1">
                  <Input
                    placeholder="-"
                    value={stat.right}
                    onChange={(e) =>
                      handleStatChange(stat.stat, "right", e.target.value)
                    }
                    className="w-16 h-7 text-center mx-auto"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            className="bg-black text-white hover:bg-black/80"
          >
            Save Updates
          </Button>
        </div>
      </div>
    </div>
  );
}
