import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import './styles/main.scss';

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <header>
        ServiceWatcher 
      </header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
      <footer>
        &copy; {currentYear} ServiceWatcher. Todos os direitos reservados.
      </footer>
    </Router>
  );
}

export default App;
