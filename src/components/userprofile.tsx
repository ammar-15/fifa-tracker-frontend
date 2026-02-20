import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { apiFetch } from "@/lib/api";
import { resolveProfilePhotoUrl } from "@/lib/profile-photo";

interface UserProfileData {
  username: string | null;
  email: string | null;
  profilePhoto: string | null;
}

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [username, setUsername] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const res = await apiFetch(
          `/userprofile?email=${encodeURIComponent(user.email ?? "")}`,
          {
            method: "GET",
          }
        );

        const json = (await res.json()) as { user?: UserProfileData };
        setProfile(json.user ?? null);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchProfile();
  }, [user?.email]);

  useEffect(() => {
    if (!profile) return;

    setUsername(profile.username ?? "");
    setProfilePhoto(profile.profilePhoto ?? null);
  }, [profile]);

  const resolvePhotoFromResponse = (responseBody: unknown): string | null => {
    if (!responseBody || typeof responseBody !== "object") {
      return null;
    }

    const body = responseBody as {
      profilePhoto?: unknown;
      photo?: unknown;
      user?: { profilePhoto?: unknown; photo?: unknown };
    };

    if (typeof body.profilePhoto === "string") {
      return body.profilePhoto;
    }

    if (typeof body.photo === "string") {
      return body.photo;
    }

    if (typeof body.user?.profilePhoto === "string") {
      return body.user.profilePhoto;
    }

    if (typeof body.user?.photo === "string") {
      return body.user.photo;
    }

    return null;
  };

  const refreshProfile = async () => {
    if (!user?.email) return;

    try {
      const res = await apiFetch(
        `/userprofile?email=${encodeURIComponent(user.email ?? "")}`,
        { method: "GET" }
      );
      const json = (await res.json()) as { user?: UserProfileData };
      setProfile(json.user ?? null);
      setUsername(json.user?.username ?? "");
      setProfilePhoto(json.user?.profilePhoto ?? null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("email", profile?.email ?? user?.email ?? "");
    formData.append("username", username ?? "");
    if (newPassword) formData.append("password", newPassword);
    if (selectedFile) formData.append("profilePhoto", selectedFile);

    try {
      const res = await apiFetch("/userprofile", {
        method: "PUT",
        body: formData,
      });
      const responseBody = (await res.json()) as unknown;
      const uploadedPhoto = resolvePhotoFromResponse(responseBody);

      if (uploadedPhoto !== null) {
        setProfilePhoto(uploadedPhoto);
      } else if (selectedFile) {
        await refreshProfile();
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username,
              profilePhoto: uploadedPhoto ?? prev.profilePhoto,
            }
          : prev
      );
      setSelectedFile(null);
      setNewPassword("");
      setShowPhotoDialog(false);
      console.log("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col gap-6">
      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-gray-300">
        {profilePhoto ? (
          <img
            src={resolveProfilePhotoUrl(profilePhoto)}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={resolveProfilePhotoUrl(null)}
            alt="Profile placeholder"
            className="h-full w-full object-cover"
          />
        )}

        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogTrigger asChild>
            <div className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-1 shadow">
              <Pencil size={16} />
            </div>
          </DialogTrigger>
          <DialogContent>
            <Label>Upload New Profile Photo</Label>
            <div className="rounded-md border border-dashed p-4 text-center">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
              />
              {selectedFile ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a profile photo
                </p>
              )}
            </div>
            <Button onClick={() => void handleSave()}>Save Photo</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={username ?? ""}
          onChange={(e) => setUsername(e.target.value ?? "")}
        />
        <Pencil size={18} className="text-muted-foreground" />
      </div>

      <div>
        <Label>Email</Label>
        <p>{profile?.email ?? "Loading..."}</p>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">Change Password</Button>
        </DialogTrigger>
        <DialogContent>
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword ?? ""}
            onChange={(e) => setNewPassword(e.target.value ?? "")}
          />
          <Button onClick={() => void handleSave()} className="mt-4">
            Save Password
          </Button>
        </DialogContent>
      </Dialog>

      <Button onClick={() => void handleSave()}>Save Changes</Button>
    </div>
  );
}
