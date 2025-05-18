import './App.css';
import FaceDetection from './FaceDetection';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FocusTrackerPage from './pages/FocusTrackerPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RankingPage from './pages/RankingPage';
import SignupPage from './pages/SignupPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/focus" element={<FocusTrackerPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </BrowserRouter>
    /*<div className="App">
    <FaceDetection></FaceDetection>
  </div>*/
  );
}

export default App;
