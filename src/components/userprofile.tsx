import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Dropzone from "react-dropzone";
import { Pencil } from "lucide-react";

interface UserProfileData {
  username: string;
  email: string;
  profilePhoto: string; 
}

export default function UserProfile() {
  const [data, setData] = useState<UserProfileData | null>(null);
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5050/userprofile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", username || data?.username || "");
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    if (newPassword) formData.append("password", newPassword);

    try {
      await fetch("http://localhost:5050/userprofile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto mt-10">
      <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border border-gray-300">
        {data?.profilePhoto ? (
          <img
            src={data.profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <Dropzone onDrop={acceptedFiles => setProfilePhoto(acceptedFiles[0])}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow cursor-pointer"
            >
              <input {...getInputProps()} />
              <Pencil size={16} />
            </div>
          )}
        </Dropzone>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={username || data?.username || ""}
          onChange={e => setUsername(e.target.value)}
        />
        <Pencil size={18} className="text-muted-foreground" />
      </div>

      <div>
        <Label>Email</Label>
        <p>{data?.email || "Loading..."}</p>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">Change Password</Button>
        </DialogTrigger>
        <DialogContent>
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </DialogContent>
      </Dialog>

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
