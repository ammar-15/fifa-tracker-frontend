import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Signup1Props {
  heading?: string;
  subheading?: string;
  logo: {
    src: string;
    alt: string;
    title?: string;
  };
  signupText?: string;
  googleText?: string;
  loginText?: string;
  onLoginClick?: () => void;
}

const Signup1 = ({
  heading = "Signup",
  subheading = "Create a new account",
  logo = {
    src: "",
    alt: "logo",
    title: "",
  },
  googleText = "Sign up with Google",
  signupText = "Create an account",
  loginText = "Already have an account?",
  onLoginClick,
}: Signup1Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const validateUsername = (value: string) => {
    const regex = /^[a-z0-9]+$/;
    return regex.test(value);
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUsernameError("");

    if (!validateUsername(username)) {
      setUsernameError(
        "Username must contain only lowercase letters and numbers."
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes("username")) {
          setUsernameError(data.error);
        } else {
          setError(data.error || "signup failed");
        }
        return;
      }

      console.log("signup successful:", data);
      localStorage.setItem("token", data.token);
    } catch (err: any) {
      setError(err.message);
      console.error("signup error:", err);
    }
  };

  return (
    <section className="h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border border-muted bg-white px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <a>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-12"
                />
              </a>
            </div>
            <h1 className="text-3xl font-semibold">{heading}</h1>
            {subheading && (
              <p className="text-sm text-muted-foreground">{subheading}</p>
            )}
          </div>
          <form className="flex w-full flex-col gap-8" onSubmit={handlesubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white"
                />
                {usernameError && (
                  <p className="text-red-500 text-sm">{usernameError}</p>
                )}
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  {signupText}
                </Button>
                <Button variant="outline" className="w-full">
                  <FcGoogle className="mr-2 size-5" />
                  {googleText}
                </Button>
              </div>
            </div>
          </form>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{loginText}</p>
            <button
              type="button"
              onClick={onLoginClick}
              className="font-medium text-primary hover:underline bg-transparent border-none p-0 m-0"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup1 };
