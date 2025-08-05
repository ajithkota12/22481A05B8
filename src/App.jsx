import { Routes, Route } from 'react-router-dom';
import UrlShortenerPage from './pages/UrlShortenerPage';
import UrlStatisticsPage from './pages/UrlStatisticsPage';
import RedirectPage from './pages/RedirectPage';
import { Log } from './services/logger';

Log("frontend", "info", "app", "Application started.");

function App() {
  return (
    <Routes>
      <Route path="/" element={<UrlShortenerPage />} />
      <Route path="/stats" element={<UrlStatisticsPage />} />
      <Route path="/:shortcode" element={<RedirectPage />} />
    </Routes>
  );
}

export default App;