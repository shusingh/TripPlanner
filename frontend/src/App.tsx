import { Route, Routes } from 'react-router-dom';

import PlannerPage from './pages/Planner/Planner';
import ResultsPage from './pages/Results/Results';

import LandingPage from '@/pages/LandingPage/LandingPage';

function App() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<PlannerPage />} path="/planner" />
      <Route element={<ResultsPage />} path="/planner/results" />
    </Routes>
  );
}

export default App;
