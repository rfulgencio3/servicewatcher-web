import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';
import Plans from './components/Plans';
import './styles/main.scss';
import logo from './assets/images/logo.png';

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <header>
        <img src={logo} alt="ServiceWatcher Logo" className="logo" />
        <nav>
          <Link to="/contact">Contact</Link>
          <Link to="/plans">Plans</Link>
          <Link to="/signup">SignUp</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/plans" element={<Plans />} />
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
