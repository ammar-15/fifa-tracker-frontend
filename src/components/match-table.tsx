import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import MatchStatsTable from "./matchstats-table";
import { apiFetch } from "@/lib/api";

interface Match {
  uniqueid: string;
  createdAt: string;
  username: string;
  oppUsername: string;
  team1: string;
  team1Goals: string;
  team2: string;
  team2Goals: string;
  timePlayed: string;
  stats: ParsedStat[];
}

interface ParsedStat {
  stat: string;
  left: string;
  right: string;
}

interface AuthMeResponse {
  user?: {
    username?: string;
  };
}

export default function MatchTable() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [decodedUsername, setDecodedUsername] = useState("");

  const fetchMatches = async () => {
    setLoading(true);

    try {
      const meRes = await apiFetch("/auth/me", { method: "GET" });
      if (!meRes.ok) {
        setMatches([]);
        return;
      }

      const meData = (await meRes.json()) as AuthMeResponse;
      const username = meData.user?.username;
      if (!username) {
        setMatches([]);
        return;
      }

      setDecodedUsername(username);
      const response = await apiFetch(`/matchdata?username=${encodeURIComponent(username)}`);
      const data = (await response.json()) as Match[];
      setMatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMatches();
  }, []);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Opponent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : matches.length > 0 ? (
            matches.map((match) => {
              const isUserOpp = match.oppUsername === decodedUsername;
              const opponent = isUserOpp ? match.username : match.oppUsername;

              return (
                <TableRow
                  key={match.uniqueid}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setSelectedMatch(match);
                    setDialogOpen(true);
                  }}
                >
                  <TableCell>
                    {new Date(match.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{`${match.team1} vs ${match.team2}`}</TableCell>
                  <TableCell>{`${match.team1Goals} - ${match.team2Goals}`}</TableCell>
                  <TableCell>{opponent}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No matches found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full !max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Match Stats</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <MatchStatsTable
              match={selectedMatch}
              onClose={() => {
                setDialogOpen(false);
                void fetchMatches();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
