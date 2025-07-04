import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/loading-screen";
import StatsTable from "@/components/stats-table";
import { jwtDecode } from "jwt-decode";

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

export default function AddButton({
  onSaveSuccess,
}: {
  onSaveSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedStats, setParsedStats] = useState<ParsedResult | null>(null);

  let loggedInUsername = "";
  const token = localStorage.getItem("token");
  if (token && token !== "undefined") {
    try {
      const decoded = jwtDecode<{ username: string }>(token);
      loggedInUsername = decoded.username;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setParsedStats(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5050/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      console.log("Upload successful");

      await new Promise((resolve) => setTimeout(resolve, 4000));

      const statsRes = await fetch("http://localhost:5050/parsed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!statsRes.ok) throw new Error("Stats fetch failed");

      const json = await statsRes.json();
      setParsedStats(json.data);

      if (json.uniqueid) {
        localStorage.setItem("uniqueid", json.uniqueid);
      }

      setFile(null);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while uploading or fetching stats.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Match</Button>
      </DialogTrigger>
      <DialogContent className="w-full !max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {uploading
              ? "Uploading..."
              : parsedStats
              ? "Match Stats"
              : "Upload New Match Screenshot"}
          </DialogTitle>
        </DialogHeader>

        {uploading ? (
          <LoadingScreen />
        ) : parsedStats ? (
          <StatsTable
            setOpen={setOpen}
            loggedInUsername={loggedInUsername}
            onSaveSuccess={onSaveSuccess}
          />
        ) : (
          <>
            <label
              htmlFor="file-upload"
              className={cn(
                "border border-dashed border-gray-400 rounded-md px-4 py-10 text-center text-sm text-muted-foreground",
                "hover:bg-muted cursor-pointer transition-all"
              )}
            >
              {file ? file.name : "Click to upload a photo"}
              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <DialogFooter className="pt-4">
              <Button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="w-full bg-black text-white hover:bg-black/80"
              >
                Confirm Upload
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
