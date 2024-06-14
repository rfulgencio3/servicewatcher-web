import React from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.scss';

const UserDashboard = ({ user }) => {
  return (
    <div className="user-dashboard">
      <div className="welcome-section">
        <h2>Welcome, {user.name}</h2>
        <p>We're glad to have you back!</p>
      </div>
      <div className="dashboard-links">
        <Link to="/dashboard" className="dashboard-link">
          <div className="link-icon">📊</div>
          <div className="link-text">Go to Dashboard</div>
        </Link>
        <Link to="/plan-info" className="dashboard-link">
          <div className="link-icon">📋</div>
          <div className="link-text">Plan Information</div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
