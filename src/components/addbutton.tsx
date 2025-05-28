import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Use JPG or PNG files only</DialogDescription>
        </DialogHeader>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="mt-2"
          style={{ cursor: "pointer" }}
        />{" "}
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
