import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import HomeComponent from "./pages/home";
import VideoMeetComponent from "./pages/VideoMeet";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          <Route path="/"     element={<LandingPage />} />
            <Route path="/about"   element={<About />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/:url" element={<VideoMeetComponent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;