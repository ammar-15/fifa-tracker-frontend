import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

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
  onSaveSuccess: () => void;
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

export default function StatsTable({
  setOpen,
  loggedInUsername,
  onSaveSuccess,
}: StatsTableProps) {
  const [formData, setFormData] = useState<ParsedResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedRes = await apiFetch("/parsed");
        const parsedJson = (await parsedRes.json()) as {
          data: ParsedResult;
          uniqueid?: string;
        };
        const parsed = parsedJson.data;

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
    };

    void fetchData();
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
      const res = await apiFetch("/savedata", {
        method: "POST",
        body: { ...formData, uniqueid },
      });

      const responseJson = await res.json();
      console.log("Save response:", responseJson);
      setOpen(false);
      onSaveSuccess();
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data");
    }
  };

  if (!formData) return <div className="py-4 text-center">Scanning...</div>;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 py-4 md:flex-row">
      <div className="flex w-full flex-col gap-4 md:w-3/3">
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
            className="flex-1 rounded border px-2 py-1 text-sm"
          >
            <option value="">Select Opponent</option>
            <option value="akuul15">akuul15</option>
            <option value="ammarosborn">ammarosborn</option>
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
                  <TableCell className="w-1/4 p-1 text-center">
                    <Input
                      placeholder="-"
                      value={matched?.left ?? ""}
                      onChange={(e) =>
                        handleStatChange(stat, "left", e.target.value)
                      }
                      className="mx-auto h-7 w-16 text-center"
                    />
                  </TableCell>
                  <TableCell className="w-1/2 p-1 text-center text-sm font-medium">
                    {stat}
                  </TableCell>
                  <TableCell className="w-1/4 p-1 text-center">
                    <Input
                      placeholder="-"
                      value={matched?.right ?? ""}
                      onChange={(e) =>
                        handleStatChange(stat, "right", e.target.value)
                      }
                      className="mx-auto h-7 w-16 text-center"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => void handleSave()}
            className="bg-black text-white hover:bg-black/80"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
