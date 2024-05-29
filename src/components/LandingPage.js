import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoRocket } from "react-icons/go";
import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to ServiceWatcher</h1>
      <p>Monitor your websites and services effortlessly.{' '}
        <GoRocket style={{ color: 'orange', marginLeft: '0.5rem' }} /></p>
      <div className="buttons">
        <Link to="/signup">
          <button className="signup-btn">Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
      <div className="plans">
        <div className="plan-card">
          <h3>Basic Plan</h3>
          <p>Monitor up to 5 services.</p>
          <p className="price">$5/month</p>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
        <div className="plan-card">
          <h3>Pro Plan</h3>
          <p>Monitor up to 15 services.</p>
          <p className="price">$15/month</p>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
        <div className="plan-card">
          <h3>Enterprise Plan</h3>
          <p>Monitor up to 50 services.</p>
          <p className="price">$50/month</p>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
