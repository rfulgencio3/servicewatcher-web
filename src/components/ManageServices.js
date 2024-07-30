import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageServices.scss';

const ManageServices = ({ user }) => {
  const [rows, setRows] = useState([{ url: '', type: '1' }]);
  const [planLimit, setPlanLimit] = useState(0);
  const [currentServiceCount, setCurrentServiceCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState(null);
  const [servicesToSave, setServicesToSave] = useState([]);
  const navigate = useNavigate();

  const planLimits = {
    'Free Plan': 1,
    'Basic Plan': 5,
    'Pro Plan': 10,
    'Enterprise Plan': 25,
  };

  const fetchCurrentServiceCount = async () => {
    try {
      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Service/email', {
        headers: {
          'accept': '*/*',
          'email': user.email,
        },
      });

      if (response.ok) {
        const services = await response.json();
        setCurrentServiceCount(services.length);
      } else {
        const errorText = await response.text();
        setError('Failed to fetch current service count');
      }
    } catch (error) {
      setError('Error fetching current service count');
    }
  };

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/CustomerPlans/email', {
          headers: {
            'accept': '*/*',
            'email': user.email,
          },
        });

        if (response.ok) {
          const planData = await response.json();
          setPlanLimit(planLimits[planData.planType] || 0);
          fetchCurrentServiceCount();
        } else {
          const errorText = await response.text();
          setError('Failed to fetch plan details');
        }
      } catch (error) {
        setError('Error fetching plan details');
      }
    };

    fetchPlanDetails();
  }, [user.email, user.token]);

  const addRow = () => {
    if (currentServiceCount + rows.length - 1 < planLimit) {
      setRows([...rows, { url: '', type: '1' }]);
    }
  };

  const handleAddService = (index) => {
    const newService = rows[index];
    if (currentServiceCount + servicesToSave.length < planLimit) {
      setServicesToSave([...servicesToSave, newService]);
      const newRows = [...rows];
      newRows[index] = { url: '', type: '1' };
      setRows(newRows);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const service of servicesToSave) {
        const serviceToSave = {
          ...service,
          customerId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        };

        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Service', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(serviceToSave),
        });

        if (!response.ok) {
          alert('Failed to save services.');
          setLoading(false);
          return;
        }
      }

      alert('Services saved successfully!');
      setServicesToSave([]);
      fetchCurrentServiceCount();
    } catch (error) {
      alert('Error saving services.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].url = value;
    setRows(newRows);

    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      setUrlError('URL must start with "http://" or "https://"');
    } else {
      setUrlError(null);
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
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder="Enter service URL"
                className={urlError ? 'input-error' : ''}
                title={urlError ? 'URL must start with "http://" or "https://"': ''}
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
              <button
                type="button"
                className="add-service-button"
                onClick={() => handleAddService(index)}
              >
                +
              </button>
            </div>
          ))}
        </div>
        {servicesToSave.length > 0 && (
          <div className="service-list">
            <h3>Services to Save</h3>
            <ul>
              {servicesToSave.map((service, index) => (
                <li key={index}>{service.url} - {service.type}</li>
              ))}
            </ul>
          </div>
        )}
        {urlError && <div className="url-error-message">{urlError}</div>}
      </div>
      <div className="button-container">
        <button
          className="save-button"
          onClick={handleSave}
          disabled={loading || !!urlError}
        >
          Save
        </button>
        <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default ManageServices;
