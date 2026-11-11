import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import './styles.css';
import Logo from './Logo';

import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <nav className="nav">
          <Link to="/" className="brand">
            <Logo />
            Syvra<span>Fitness</span>
          </Link>
          <div className="nav-links">
            <NavLink to="/" end>Exercices</NavLink>
            <NavLink to="/workouts">Séances</NavLink>
          </div>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<ExercisesPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
        </Routes>
      </main>
      <footer className="footer">Syvra Fitness · Workout Builder</footer>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
