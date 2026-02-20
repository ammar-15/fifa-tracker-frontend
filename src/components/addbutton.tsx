import { useEffect, useState } from "react";
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

interface AuthMeResponse {
  user?: {
    username?: string;
  };
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
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const res = await apiFetch("/auth/me", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as AuthMeResponse;
        setLoggedInUsername(data.user?.username ?? "");
      } catch {
        setLoggedInUsername("");
      }
    };

    void loadUsername();
  }, []);

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
      const res = await apiFetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      await new Promise((resolve) => setTimeout(resolve, 4000));

      const statsRes = await apiFetch("/parsed");
      if (!statsRes.ok) throw new Error("Stats fetch failed");

      const json = (await statsRes.json()) as {
        data?: ParsedResult;
        uniqueid?: string;
      };
      setParsedStats(json.data ?? null);

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
                "cursor-pointer rounded-md border border-dashed border-gray-400 px-4 py-10 text-center text-sm text-muted-foreground",
                "transition-all hover:bg-muted"
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
                onClick={() => void handleUpload()}
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
