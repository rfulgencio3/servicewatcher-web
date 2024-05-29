import React from 'react';
import './Plans.scss';

function Plans() {
  return (
    <div className="plans-page">
      <h1>Our Plans</h1>
      <div className="plans">
        <div className="plan-card">
          <h3>Basic</h3>
          <p className="price">$9.99/month</p>
          <p>Monitor up to 5 services.</p>
          <button>Choose Plan</button>
        </div>
        <div className="plan-card">
          <h3>Standard</h3>
          <p className="price">$19.99/month</p>
          <p>Monitor up to 10 services.</p>
          <button>Choose Plan</button>
        </div>
        <div className="plan-card">
          <h3>Premium</h3>
          <p className="price">$29.99/month</p>
          <p>Monitor up to 20 services.</p>
          <button>Choose Plan</button>
        </div>
      </div>
    </div>
  );
}

export default Plans;
