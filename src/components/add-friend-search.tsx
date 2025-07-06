import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 
import { jwtDecode } from "jwt-decode";

interface User {
  username: string;
  email: string;
}

interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  exp: number;
}

export default function AddFriendSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [fromUsername, setFromUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setFromUsername(decoded.username);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setFromUsername(null);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 2) return setResults([]);

      const res = await fetch(`http://localhost:5050/searchuser?q=${query}`);
      const data = await res.json();
      setResults(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const sendRequest = async (toUsername: string) => {
    if (!fromUsername) {
      toast.error("User not logged in or token invalid");
      return;
    }

    const res = await fetch("http://localhost:5050/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromUsername, to: toUsername }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      toast.error("Server response was not valid JSON");
      return;
    }

    if (!res.ok) {
      if (data.error === "Already sent") {
        toast("Friend request already sent!", {
          description: `You've already sent a request to @${toUsername}`,
        });
      } else {
        toast.error(data.error || "Failed to send friend request.");
      }
    } else {
      toast.success("Friend request sent!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 2) {
      const res = await fetch(`http://localhost:5050/searchuser?q=${query}`);
      const data = await res.json();
      setResults(data);
    }
  };

  return (
    <div className="w-full max-w-md relative mt-5">
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Search users by username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {results.length > 0 && (
        <div className="absolute z-50 w-full bg-white border rounded-md shadow-md mt-2">
          {results.map((user) => (
            <div
              key={user.email}
              className="p-4 border-b last:border-none flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button size="sm" onClick={() => sendRequest(user.username)}>
                Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
