import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loginpage from "./login/Loginpage";
import Signup from "./login/Signup";
import Dashboard from "./screens/Dashboard";
import Analytics from "./screens/Analytics";
import Matches from "./screens/Matches";
import Friends from "./screens/Friends";
import User from "./screens/User";
import DebugAuth from "./pages/DebugAuth";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/auth/useAuth";

function App() {
  return (
    <AuthProvider>
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
            <Route path="/debug-auth" element={<DebugAuth />} />
          </Routes>
        </div>
      </Router>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;
