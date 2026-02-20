import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";

export function LoginForm() {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [loading, navigate, user]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Sign in with Google to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              className="w-full"
              disabled={loading}
              onClick={() => void loginWithGoogle()}
            >
              Login with Google
            </Button>
            {user && (
              <Button type="button" variant="outline" onClick={() => void logout()}>
                Logout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
