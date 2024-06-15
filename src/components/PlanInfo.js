import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlanInfo.scss';

const PlanInfo = ({ user }) => {
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/CustomerPlans/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          setPlanInfo(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (error) {
        setError('Failed to fetch plan information.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanInfo();
  }, [user]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!planInfo || planInfo.length === 0) {
    return (
      <div className="error-container">
        <div className="no-plan-info">No plan information available.</div>
        <button className="back-button" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="plan-info">
      <h2>Plan Information</h2>
      <div className="plan-details">
        {planInfo.map((plan, index) => (
          <div key={index} className="plan-card">
            <h3>{plan.planName}</h3>
            <p>{plan.description}</p>
            <p>Price: ${plan.price}</p>
            <p>Start Date: {new Date(plan.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(plan.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default PlanInfo;
