import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button type="button" variant="outline" onClick={() => void logout()}>
            Logout
          </Button>
        </>
      ) : (
        <Button type="button" disabled={loading} onClick={() => void loginWithGoogle()}>
          Login with Google
        </Button>
      )}
    </div>
  );
}
