import React from 'react';
import { Link } from 'react-router-dom';
import useCustomer from '../hooks/useCustomer';
import './UserPage.scss';

const UserPage = ({ user }) => {
  const { customer, loading, error } = useCustomer(user);

  if (loading) {
    return <div className="loading-overlay"><div className="loader"></div></div>;
  }

  return (
    <div className="user-page">
      <div className="welcome-section">
        <h2>Welcome, {user.name}</h2>
        <p>We're glad to have you back!</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="dashboard-links">
        <Link to="/choose-plan" className="dashboard-link">
          <div className="link-icon">📋</div>
          <div className="link-text">Choose Plan</div>
        </Link>
        {customer && customer.currentPlan ? (
          <>
            <Link to="/plan-info" className="dashboard-link">
              <div className="link-icon">📄</div>
              <div className="link-text">Plan Information</div>
            </Link>
            <Link to="/manage-services" className="dashboard-link">
              <div className="link-icon">🔧</div>
              <div className="link-text">Manage Services</div>
            </Link>
            <Link to="/dashboard" className="dashboard-link">
              <div className="link-icon">📊</div>
              <div className="link-text">Go to Dashboard</div>
            </Link>
          </>
        ) : (
          <p className="no-plan-message">You do not have an active plan. Please choose a plan to get started.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
