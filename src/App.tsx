import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loginpage from "./login/loginpage";
import Signup from "./login/Signup";

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
