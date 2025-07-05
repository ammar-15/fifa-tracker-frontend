import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loginpage from "./login/Loginpage";
import Signup from "./login/Signup";
import Dashboard from "./screens/Dashboard";
import Analytics from "./screens/Analytics";
import Matches from "./screens/Matches";
import Friends from "./screens/Friends";
import User from "./screens/User";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID!}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Loginpage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/user" element={<User />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </Router>
      <Toaster richColors position="top-right" />
    </GoogleOAuthProvider>
  );
}

export default App;
