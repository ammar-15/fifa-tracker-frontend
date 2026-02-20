import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { apiFetch } from "@/lib/api";

export default function DebugAuth() {
  const { user, accessToken, loading, loginWithGoogle, logout } = useAuth();
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callAuthMe = async () => {
    setError(null);
    setResponse(null);

    try {
      const res = await apiFetch("/auth/me", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data, null, 2));
        return;
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Debug Auth</h1>
      <p>Loading: {loading ? "yes" : "no"}</p>
      <p>User email: {user?.email ?? "Not logged in"}</p>
      <p>Access token present: {accessToken ? "yes" : "no"}</p>

      <div className="flex gap-2">
        <button
          type="button"
          className="rounded bg-black px-3 py-2 text-white"
          onClick={() => void loginWithGoogle()}
        >
          Login with Google
        </button>
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={() => void logout()}
        >
          Logout
        </button>
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={() => void callAuthMe()}
        >
          Call /auth/me
        </button>
      </div>

      {error && <pre className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</pre>}
      {response && (
        <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">
          {response}
        </pre>
      )}
    </div>
  );
}
