import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PresentationPage from "./pages/PresentationPage";
import SettingPage from "./pages/SettingPage";

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  React.useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#1e1e1e";
      document.body.style.color = "#f5f5f5";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  }, [darkMode]);

  return (
    <Router>
      {/* <CustomHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/presentation/:presentationId/:slideId"
          element={<PresentationPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
