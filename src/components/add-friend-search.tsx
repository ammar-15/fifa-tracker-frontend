import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface User {
  username: string;
  email: string;
}

export default function AddFriendSearch({
  fromUsername,
}: {
  fromUsername: string | null;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      const res = await apiFetch(`/searchuser?q=${encodeURIComponent(query)}`);
      const data = (await res.json()) as User[];
      setResults(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const sendRequest = async (toUsername: string) => {
    if (!fromUsername) {
      toast.error("User not logged in");
      return;
    }

    const res = await apiFetch("/friends/request", {
      method: "POST",
      body: { from: fromUsername, to: toUsername },
    });

    let data: { error?: string } | null = null;
    try {
      data = (await res.json()) as { error?: string };
    } catch {
      toast.error("Server response was not valid JSON");
      return;
    }

    if (!res.ok) {
      if (data?.error === "Already sent") {
        toast("Friend request already sent!", {
          description: `You've already sent a request to @${toUsername}`,
        });
      } else {
        toast.error(data?.error || "Failed to send friend request.");
      }
    } else {
      toast.success("Friend request sent!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 2) {
      const res = await apiFetch(`/searchuser?q=${encodeURIComponent(query)}`);
      const data = (await res.json()) as User[];
      setResults(data);
    }
  };

  return (
    <div className="relative mt-5 w-full max-w-md">
      <form onSubmit={(e) => void handleSubmit(e)}>
        <Input
          placeholder="Search users by username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow-md">
          {results.map((user) => (
            <div
              key={user.email}
              className="flex items-center justify-between border-b p-4 last:border-none"
            >
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button size="sm" onClick={() => void sendRequest(user.username)}>
                Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
