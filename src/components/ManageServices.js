import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageServices.scss';

const ManageServices = ({ user }) => {
  const [rows, setRows] = useState([{ url: '', type: '1' }]);
  const [planLimit, setPlanLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const planLimits = {
    'Free Trial': 1,
    'Basic Plan': 5,
    'Pro Plan': 15,
    'Enterprise Plan': 50,
  };

  useEffect(() => {
    const fetchPlanDetails = async () => {
      console.log('fetchPlanDetails called');
      try {
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/CustomerPlans/email', {
          headers: {
            'accept': '*/*',
            'email': user.email,
          },
        });

        console.log('Response received:', response);

        if (response.ok) {
          const planData = await response.json();
          console.log('Plan data:', planData);
          setPlanLimit(planLimits[planData.planType] || 0);
        } else {
          const errorText = await response.text();
          console.log('Failed to fetch plan details:', errorText);
          setError('Failed to fetch plan details');
        }
      } catch (error) {
        console.log('Error fetching plan details:', error);
        setError('Error fetching plan details');
      }
    };

    fetchPlanDetails();
  }, [user.email]);

  const addRow = () => {
    setRows([...rows, { url: '', type: '1' }]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const servicesToSave = rows.map(row => ({
        ...row,
        customerId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      }));

      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(servicesToSave),
      });

      if (response.ok) {
        alert('Services saved successfully!');
      } else {
        alert('Failed to save services.');
      }
    } catch (error) {
      alert('Error saving services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-services">
      {loading && <div className="loading-overlay"><div className="loader"></div></div>}
      <h2>Manage Services</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="container">
        <div className="header">
          <div>Service URL</div>
          <div>Type</div>
          <div>Action</div>
        </div>
        <div className="rows-container">
          {rows.map((row, index) => (
            <div className="row" key={index}>
              <input
                type="url"
                value={row.url}
                onChange={(e) => {
                  const newRows = [...rows];
                  newRows[index].url = e.target.value;
                  setRows(newRows);
                }}
                placeholder="Enter service URL"
              />
              <select
                value={row.type}
                onChange={(e) => {
                  const newRows = [...rows];
                  newRows[index].type = e.target.value;
                  setRows(newRows);
                }}
              >
                <option value="1">Website</option>
                <option value="2">Service</option>
              </select>
              {index === rows.length - 1 && rows.length < planLimit && (
                <button type="button" className="add-button" onClick={addRow}>+</button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="button-container">
        <button className="save-button" onClick={handleSave} disabled={loading}>
          Save
        </button>
        <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default ManageServices;
