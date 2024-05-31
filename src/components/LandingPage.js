import React from 'react';
import { Link } from 'react-router-dom';
import { GoRocket } from "react-icons/go";
import './LandingPage.scss';

const LandingPage = () => {
  const plans = [
    { name: 'Free Trial', services: 1, price: 0, duration: '7-days trial' },
    { name: 'Basic Plan', services: 5, price: 5, duration: '$5/month' },
    { name: 'Pro Plan', services: 15, price: 10, duration: '$10/month' },
    { name: 'Enterprise Plan', services: 50, price: 25, duration: '$25/month' },
  ];

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
        {plans.map(plan => (
          <div className="plan-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <p>Monitor up to {plan.services} services.</p>
            <p className="price">{plan.duration}</p>
            {plan.price > 0 ? (
              <p className="price-per-service">
                Only ${(plan.price / plan.services).toFixed(2)} per service
              </p>
            ) : (
                <p className="price-per-service">
                    Free by period
              </p>
            )}
            <Link to="/signup">
              <button className="signup-btn">Sign Up</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
