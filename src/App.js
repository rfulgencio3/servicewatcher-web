import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Contact from './components/Contact';
import About from './components/About';
import NotFound from './components/NotFound';
import ChoosePlan from './components/ChoosePlan';
import UserDashboard from './components/UserDashboard';
import PlanInfo from './components/PlanInfo'; // Import PlanInfo
import './styles/main.scss';
import logo from './assets/images/logo.png';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    const handleScroll = () => {
      const header = document.getElementById('myHeader');
      const sticky = header.offsetTop;
      if (window.pageYOffset > sticky) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <header id="myHeader">
        <Link to="/">
          <img src={logo} alt="ServiceWatcher Logo" className="logo" />
        </Link>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {!user ? (
            <>
              <Link to="/signup">SignUp</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/user-dashboard">My Dashboard</Link>
              <span>Hello, {user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/choose-plan" element={user ? <ChoosePlan /> : <Login setUser={setUser} />} />
          <Route path="/user-dashboard" element={user ? <UserDashboard user={user} /> : <Login setUser={setUser} />} />
          <Route path="/plan-info" element={user ? <PlanInfo user={user} /> : <Login setUser={setUser} />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <footer>
        &copy; {currentYear} ServiceWatcher. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;
