import { Signup1 } from "@/components/signup1";
import uclball from "../assets/uclball.png";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/");
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Signup1
          onLoginClick={handleLoginClick}
          logo={{
            src: uclball,
            alt: "Logo",
            title: "FIFA Tracker",
          }}
        />
      </div>
    </div>
  );
}
export default Signup;
