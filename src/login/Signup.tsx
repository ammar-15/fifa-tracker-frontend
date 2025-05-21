import { Signup1 } from "@/components/signup1";
import uclball from "../assets/uclball.png";

function Signup() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Signup1
          logo={{
            src: uclball,
            alt: "Logo",
            title: "FIFA Tracker"
          }}
        />
      </div>
    </div>
  );
}
export default Signup;