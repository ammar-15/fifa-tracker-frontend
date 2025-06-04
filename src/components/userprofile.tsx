import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Dropzone from "react-dropzone";
import { Pencil } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface UserProfileData {
  username: string;
  email: string;
  profilePhoto: string;
}

interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  exp: number;
}

export default function UserProfile() {
  const [data, setData] = useState<UserProfileData | null>(null);
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userEmail = decoded.email;

      fetch(`http://localhost:5050/userprofile?email=${userEmail}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setData(json.user);
          setUsername(json.user.username);
        })
        .catch(console.error);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("email", data?.email || "");
    formData.append("username", username || data?.username || "");
    if (newPassword) formData.append("password", newPassword);

    try {
      await fetch("http://localhost:5050/userprofile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      console.log("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handlePhotoUpload = async () => {
    const token = localStorage.getItem("token");
    if (!profilePhoto) return alert("No file selected.");

    const formData = new FormData();
    formData.append("email", data?.email || "");
    formData.append("profilePhoto", profilePhoto);

    try {
      await fetch("http://localhost:5050/userprofile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setShowPhotoDialog(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo.");
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

        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogTrigger asChild>
            <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow cursor-pointer">
              <Pencil size={16} />
            </div>
          </DialogTrigger>
          <DialogContent>
            <Label>Upload New Profile Photo</Label>
            <Dropzone
              onDrop={(acceptedFiles) => setProfilePhoto(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="p-4 border border-dashed rounded-md cursor-pointer text-center"
                >
                  <input {...getInputProps()} />
                  {profilePhoto ? (
                    <p>{profilePhoto.name}</p>
                  ) : (
                    <p>Drag or click to select a photo</p>
                  )}
                </div>
              )}
            </Dropzone>
            <Button onClick={handlePhotoUpload}>Confirm Upload</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
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
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
      </Dialog>

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
