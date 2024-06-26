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
          method: 'GET',
          headers: {
            'accept': '*/*',
            'email': user.email,
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPlanInfo(data);
        } else {
          const errorData = await response.json();
          setError(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error fetching plan information:', error);
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
        <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!planInfo || planInfo.length === 0) {
    return (
      <div className="error-container">
        <div className="no-plan-info">No plan information available.</div>
        <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="plan-info">
      <h2>Plan Information</h2>
      <div className="table-container">
        <table className="plan-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {planInfo.map((plan, index) => {
              const isActive = new Date(plan.endDate) > new Date();
              return (
                <tr key={index} className={isActive ? 'active' : 'inactive'}>
                  <td>{plan.planName}</td>
                  <td>{plan.planDescription}</td>
                  <td>${plan.planPrice}</td>
                  <td>{new Date(plan.startDate).toLocaleDateString()}</td>
                  <td>{new Date(plan.endDate).toLocaleDateString()}</td>
                  <td className={`plan-status ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
    </div>
  );
};

export default PlanInfo;
