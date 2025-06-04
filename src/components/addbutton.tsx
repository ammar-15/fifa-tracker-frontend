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

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch("http://localhost:5050/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("upload failed");
      console.log("upload successful");
      setOpen(false);
      setFile(null);
    } catch (err) {
      console.error("error uploading:", err);
    } finally {
      setUploading(false);
    }
  };

 return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Match</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Upload New Match Screenshot</DialogTitle>
        </DialogHeader>

        <label
          htmlFor="file-upload"
          className={cn(
            "border border-dashed border-gray-400 rounded-md px-4 py-10 text-center text-sm text-muted-foreground",
            "hover:bg-muted cursor-pointer transition-all"
          )}
        >
          {file ? file.name : "Drag or click to select a photo"}
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
            {uploading ? "Uploading..." : "Confirm Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
