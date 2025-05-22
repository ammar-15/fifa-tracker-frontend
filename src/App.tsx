import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loginpage from "./login/Loginpage";
import Signup from "./login/Signup";
import Dashboard from "./screens/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID!}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Loginpage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
