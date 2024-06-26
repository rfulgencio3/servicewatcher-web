import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageServices.scss';

const ManageServices = ({ user }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [planLimit, setPlanLimit] = useState(0);
  const navigate = useNavigate();

  const planLimits = {
    'Free Trial': 1,
    'Basic Plan': 5,
    'Pro Plan': 15,
    'Enterprise Plan': 50,
  };

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/CustomerPlan', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'email': user.email,
          },
        });

        if (response.ok) {
          const planData = await response.json();
          setPlanLimit(planLimits[planData.planType] || 0);
        } else {
          setError('Failed to fetch plan details');
        }
      } catch (error) {
        setError('Error fetching plan details');
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Services', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const servicesData = await response.json();
          setServices(servicesData);
        } else {
          setError('Failed to fetch services');
        }
      } catch (error) {
        setError('Error fetching services');
      }
    };

    fetchPlanDetails();
    fetchServices();
  }, [user.token, user.email]);

  const handleAddService = async (e) => {
    e.preventDefault();

    if (services.length >= planLimit) {
      setError(`You have reached the limit of ${planLimit} services for your plan.`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: serviceName, url: serviceUrl, description, customerId: user.id }),
      });

      if (response.ok) {
        const newService = await response.json();
        setServices([...services, newService]);
        setServiceName('');
        setServiceUrl('');
        setDescription('');
        setError('');
      } else {
        setError('Failed to add service');
      }
    } catch (error) {
      setError('Error adding service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-services">
      {loading && <div className="loading-overlay"><div className="loader"></div></div>}
      <h2>Manage Services</h2>
      <form onSubmit={handleAddService}>
        <label>Service Name</label>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
        <label>Service URL</label>
        <input
          type="url"
          value={serviceUrl}
          onChange={(e) => setServiceUrl(e.target.value)}
          required
        />
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading || services.length >= planLimit}>Add Service</button>
      </form>
      <div className="services-list">
        <h3>Your Services</h3>
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              {service.name} - {service.url}
            </li>
          ))}
        </ul>
        {services.length < planLimit && (
          <button className="add-service-button" onClick={handleAddService}>+</button>
        )}
      </div>
      <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
    </div>
  );
};

export default ManageServices;
