import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './UserPage.scss';

const UserPage = () => {
  const { user, loading: authLoading, error } = useContext(AuthContext);
  const [hasPlan, setHasPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inactivePlan, setInactivePlan] = useState(false);
  const navigate = useNavigate();

  const fetchUserPlan = async () => {
    if (user) {
      try {
        setIsLoading(true);
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

          // Verificar se o plano é inativo
          const today = new Date();
          const inactive = planData.some(plan => !plan.isActive || new Date(plan.endDate) < today);
          setInactivePlan(inactive);
        } else {
          setHasPlan(false);
        }
      } catch (error) {
        setHasPlan(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserPlan();
  }, [user]);

  const handleNavigation = (path) => {
    setIsLoading(true);
    fetchUserPlan().then(() => {
      setIsLoading(false);
      navigate(path);
    });
  };

  if (authLoading || isLoading) {
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
      {inactivePlan && (
        <div className="alert-message">
          Your last plan is inactive. Please verify your plan.
        </div>
      )}
      <div className="dashboard-links">
        <button onClick={() => handleNavigation('/choose-plan')} className="dashboard-link">
          <div className="link-icon">📋</div>
          <div className="link-text">Choose Plan</div>
        </button>
        {hasPlan ? (
          <>
            <button onClick={() => handleNavigation('/plan-info')} className="dashboard-link">
              <div className="link-icon">📄</div>
              <div className="link-text">Plan Information</div>
            </button>
            <button onClick={() => handleNavigation('/manage-services')} className="dashboard-link">
              <div className="link-icon">🔧</div>
              <div className="link-text">Manage Services</div>
            </button>
            <button onClick={() => handleNavigation('/dashboard')} className="dashboard-link">
              <div className="link-icon">📊</div>
              <div className="link-text">Go to Dashboard</div>
            </button>
          </>
        ) : (
          <p className="no-plan-message"><strong>You do not have an active plan. Please choose a plan to get started.</strong></p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
