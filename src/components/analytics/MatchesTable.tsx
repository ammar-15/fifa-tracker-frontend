import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Match {
  team1: string;
  team1Goals: number | string;
  team2Goals: number | string;
  team2: string;
}

interface MatchesTableProps {
  matches: Match[];
}

export default function MatchesTable({ matches }: MatchesTableProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Match</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {match.team1} vs {match.team2}
              </TableCell>
              <TableCell>
                {match.team1Goals} - {match.team2Goals}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
