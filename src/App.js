import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';
import About from './components/About';
import NotFound from './components/NotFound'; // Importando o componente NotFound
import './styles/main.scss';
import logo from './assets/images/logo.png'; // Importe a imagem da logo

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <header>
        <Link to="/">
          <img src={logo} alt="ServiceWatcher Logo" className="logo" />
        </Link>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/signup">SignUp</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} /> {}
        </Routes>
      </div>
      <footer>
        &copy; {currentYear} ServiceWatcher. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;
