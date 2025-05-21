import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loginpage from "./login/Loginpage";
import Signup from "./login/Signup";
import Dashboard from "./screens/Dashboard";

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
