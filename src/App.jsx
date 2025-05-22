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
import SettingPage from './pages/SettingPage';
import AddSubjectPage from './pages/AddSubjectPage';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ShowStatistics from './pages/statistics/ShowStatistics';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/signupPage" element={<SignupPage />} />
          <Route path="/focusTrackerPage" element={<FocusTrackerPage />} />
          <Route path="/statsPage" element={<StatsPage />} />
          <Route path="/rankingPage" element={<RankingPage />} />
          <Route path="/settingPage" element={<SettingPage />} />
          <Route path="/debugging" element={<FaceDetection />} />
          <Route path="/add-subject" element={<AddSubjectPage />} />
          <Route path="*" element={<HomePage />} />
          <Route path="/statistics" element={<ShowStatistics />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
