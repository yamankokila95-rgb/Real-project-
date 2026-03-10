import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import TrackPage from "./pages/Track";
import AdminPage from "./pages/Admin";
import AuthCallback from "./pages/AuthCallback";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
}
