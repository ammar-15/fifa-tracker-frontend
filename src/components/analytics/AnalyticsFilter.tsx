import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { type DateRange } from "react-day-picker";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface AnalyticsFilterProps {
  onSelect: (value: string) => void;
  onRangeChange: (range: { start: Date | null; end: Date | null }) => void;
}

export default function AnalyticsFilter({
  onSelect,
  onRangeChange,
}: AnalyticsFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });

  useEffect(() => {
    onRangeChange({
      start: dateRange?.from || null,
      end: dateRange?.to || null,
    });
  }, []);

  const handleRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onRangeChange({ start: range?.from || null, end: range?.to || null });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Friend" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="akuul15">akuul15</SelectItem>
          <SelectItem value="ammarosborn">ammarosborn</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-[250px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM dd, yyyy")} –{" "}
                  {format(dateRange.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleRangeChange}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
