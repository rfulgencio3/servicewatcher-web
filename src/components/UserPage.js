import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCustomer from '../hooks/useCustomer';
import './UserPage.scss';

const UserPage = ({ user }) => {
  const { customer, loading, error } = useCustomer(user);
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (user) {
        try {
          const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/CustomerPlans/email', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'email': user.email,
            },
          });

          if (response.ok) {
            const planData = await response.json();
            setHasPlan(planData && planData.length > 0);
          } else {
            setHasPlan(false);
          }
        } catch (error) {
          setHasPlan(false);
        }
      }
    };

    fetchUserPlan();
  }, [user]);

  if (loading) {
    return <div className="loading-overlay"><div className="loader"></div></div>;
  }

  return (
    <div className="user-page">
      <div className="welcome-section">
        <h2>Welcome, {user.name}</h2>
        <p>We're glad to have you back!</p>
      </div>
      {error && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="close-button" onClick={() => window.location.reload()}>&times;</span>
            <p>Failed to fetch customer information. Please try again later.</p>
          </div>
        </div>
      )}
      <div className="dashboard-links">
        <Link to="/choose-plan" className="dashboard-link">
          <div className="link-icon">📋</div>
          <div className="link-text">Choose Plan</div>
        </Link>
        {hasPlan ? (
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
          <p className="no-plan-message"><strong>You do not have an active plan. Please choose a plan to get started.</strong></p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
