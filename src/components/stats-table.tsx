import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const stats = [
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
]

export default function StatsTable() {
  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="text-center mb-6 space-y-2">
        <div className="flex justify-center items-center gap-4">
          <Input placeholder="Team Name 1" className="w-40 text-center" />
          <span className="text-xl font-bold">vs</span>
          <Input placeholder="Team Name 2" className="w-40 text-center" />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Input placeholder="0" className="w-12 text-center" />
          <span className="text-lg font-medium">-</span>
          <Input placeholder="0" className="w-12 text-center" />
        </div>
        <p className="text-sm text-muted-foreground">Time Played: 90:00</p>
      </div>

      <Table className="w-full">
        <TableBody>
          {stats.map((stat, idx) => (
            <TableRow key={idx} className="h-10">
              <TableCell className="text-center w-1/4 p-1">
                <Input placeholder="-" className="w-16 h-7 text-center mx-auto" />
              </TableCell>
              <TableCell className="text-center font-medium w-1/2 p-1 text-sm">
                {stat}
              </TableCell>
              <TableCell className="text-center w-1/4 p-1">
                <Input placeholder="-" className="w-16 h-7 text-center mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-6">
        <Button className="bg-black text-white hover:bg-black/80">Save</Button>
      </div>
    </div>
  )
}
