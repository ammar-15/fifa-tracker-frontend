import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom"; 

function Loginpage() {
    const navigate = useNavigate();
    const handleSignupClick = () => {
        navigate("/signup");
    };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSignupClick={handleSignupClick} /> 
      </div>
    </div>
  )
}
export default Loginpage;
