import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Contact from './components/Contact';
import About from './components/About';
import NotFound from './components/NotFound';
import ChoosePlan from './components/ChoosePlan';
import UserPage from './components/UserPage';
import PlanInfo from './components/PlanInfo'; 
import Dashboard from './components/Dashboard';
import ManageServices from './components/ManageServices';
import SuccessPage from './components/SuccessPage';
import './styles/main.scss';
import logo from './assets/images/logo.png';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading, logout } = useContext(AuthContext);

  useEffect(() => {
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

  const currentYear = new Date().getFullYear();

  if (loading) {
    return <div className="loading-overlay"><div className="loader"></div></div>;
  }

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
              <Link to="/user-page">My Dashboard</Link>
              <span>Hello, {user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/choose-plan" element={user ? <ChoosePlan user={user} /> : <Login />} />
          <Route path="/user-page" element={user ? <UserPage user={user} /> : <Login />} />
          <Route path="/plan-info" element={user ? <PlanInfo user={user} /> : <Login />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Login />} />
          <Route path="/manage-services" element={user ? <ManageServices user={user} /> : <Login />} />
          <Route path="/success" element={<SuccessPage />} />
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
