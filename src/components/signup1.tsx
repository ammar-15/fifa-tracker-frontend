import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

interface Signup1Props {
  heading?: string;
  subheading?: string;
  logo: {
    src: string;
    alt: string;
    title?: string;
  };
  signupText?: string;
  loginText?: string;
  onLoginClick?: () => void;
}

const Signup1 = ({
  heading = "Signup",
  subheading = "Create a new account",
  logo,
  signupText = "Continue with Google",
  loginText = "Already have an account?",
  onLoginClick,
}: Signup1Props) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  return (
    <section className="h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border border-muted bg-white px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
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

          <Button
            type="button"
            className="mt-2 w-full"
            onClick={() => void loginWithGoogle()}
          >
            {signupText}
          </Button>

          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{loginText}</p>
            <button
              type="button"
              onClick={onLoginClick ?? (() => navigate("/"))}
              className="m-0 border-none bg-transparent p-0 font-medium text-primary hover:underline"
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
