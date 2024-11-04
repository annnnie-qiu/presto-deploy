import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PresentationPage from "./pages/PresentationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/presentation/:presentationId" element={<PresentationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
