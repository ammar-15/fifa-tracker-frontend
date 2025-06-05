import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
interface Match {
  date: string;
  matchPlayed: string;
  score: string;
  opponent: string;
}

export default function MatchTable() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:5050/matches");
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Date</TableHead>
            <TableHead className="min-w-[240px]">Match Played</TableHead>
            <TableHead className="min-w-[100px]">Score</TableHead>
            <TableHead className="min-w-[140px]">Opponent</TableHead>
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
            matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.matchPlayed}</TableCell>
                <TableCell>{match.score}</TableCell>
                <TableCell>{match.opponent}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No matches found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
