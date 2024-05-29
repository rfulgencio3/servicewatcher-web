import React from 'react';
import './Plans.scss';

const Plans = () => {
  return (
    <div className="plans-page">
      <h1>Our Plans</h1>
      <div className="plans">
        <div className="plan-card">
          <h3>Basic Plan</h3>
          <p>Monitor up to 5 services.</p>
          <p className="price">$5/month</p>
          <button>Sign Up</button>
        </div>
        <div className="plan-card">
          <h3>Pro Plan</h3>
          <p>Monitor up to 15 services.</p>
          <p className="price">$15/month</p>
          <button>Sign Up</button>
        </div>
        <div className="plan-card">
          <h3>Enterprise Plan</h3>
          <p>Monitor up to 50 services.</p>
          <p className="price">$50/month</p>
          <button>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Plans;
