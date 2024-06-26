import React, { useState, useEffect } from 'react';
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
import './styles/main.scss';
import logo from './assets/images/logo.png';

function App() {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchCustomer(storedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCustomer = async (storedUser) => {
    try {
      const response = await fetch(`https://servicewatcher-planservice.azurewebsites.net/api/Customer/email`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`,
          'email': storedUser.email,
        }
      });

      if (response.ok) {
        const customerData = await response.json();
        setCustomer(customerData);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCustomer(null);
  };

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
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/choose-plan" element={user ? <ChoosePlan user={user} /> : <Login setUser={setUser} />} />
          <Route path="/user-page" element={user ? <UserPage user={user} customer={customer} /> : <Login setUser={setUser} />} />
          <Route path="/plan-info" element={user ? (customer ? <PlanInfo user={user} /> : <div className="loading-overlay"><div className="loader"></div></div>) : <Login setUser={setUser} />} />
          <Route path="/dashboard" element={user ? (customer ? <Dashboard user={user} /> : <div className="loading-overlay"><div className="loader"></div></div>) : <Login setUser={setUser} />} />
          <Route path="/manage-services" element={user ? (customer ? <ManageServices user={user} /> : <div className="loading-overlay"><div className="loader"></div></div>) : <Login setUser={setUser} />} />
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
