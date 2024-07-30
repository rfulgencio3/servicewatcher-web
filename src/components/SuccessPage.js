import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessPage.scss';

const SuccessPage = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [priceId, setPriceId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const priceId = urlParams.get('price_id');
    setPriceId(priceId);

    const fetchSessionStatus = async () => {
      try {
        const response = await fetch(`/api/Payment/session-status?price_id=${priceId}`);
        const data = await response.json();
        setStatus(data.status);
        setCustomerEmail(data.customer_email);

        if (data.status === 'complete') {
          await registerUserPlan(data);
        }
      } catch (error) {
        console.error('Failed to fetch session status:', error);
      }
    };

    fetchSessionStatus();
  }, []);

  const registerUserPlan = async (sessionData) => {
    try {
      const planData = {
        customerId: sessionData.customer_id, // Make sure sessionData has customer_id
        planId: getPlanIdFromPriceId(priceId), // Convert priceId to planId
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Example for 1-year plan
      };

      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/CustomerPlans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.token}`, // Ensure token is available
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error('Failed to register user plan');
      }
    } catch (error) {
      console.error('Error registering user plan:', error);
    }
  };

  const getPlanIdFromPriceId = (priceId) => {
    const priceIdToPlanIdMap = {
      'price_1': 1, // Example mapping, replace with actual mapping
      'price_2': 2,
      'price_3': 3,
      'price_4': 4,
    };
    return priceIdToPlanIdMap[priceId] || 0;
  };

  if (status === 'open') {
    return (
      <div className="loading-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="success-page">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
          If you have any questions, please email <a href="mailto:contact@servicewatcher.net">contact@servicewatcher.net</a>.
        </p>
        <button onClick={() => navigate('/user-page')}>Go to Dashboard</button>
        <button onClick={() => navigate('/manage-services')}>Manage Services</button>
      </div>
    );
  }

  return null;
};

export default SuccessPage;
