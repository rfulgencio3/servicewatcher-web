import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './ChoosePlan.scss';

const stripePromise = loadStripe('pk_live_51PP1NjKxd7UNSlf8BiD3GK13Oxee0VEa9CqCI4r5Wn3hJPRVq3OCnRNlW5eIw7vyatATTjmcsRF1tVP9LsGQ8oPp00CZSyIXg2');

const ChoosePlan = ({ user }) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Customer/email', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
            'email': user.email,
          },
        });

        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
          console.log('Customer fetched successfully:', customerData);
        } else {
          const errorMessage = await response.text();
          setError(`Failed to fetch customer information: ${errorMessage}`);
          console.error('Failed to fetch customer information:', errorMessage);
        }
      } catch (error) {
        console.error('Error fetching customer information:', error);
        setError('Failed to fetch customer information.');
      }
    };

    fetchCustomer();
  }, [user]);

  const handleFreePlanSelection = async () => {
    if (!customer) {
      alert('Failed to fetch customer ID. Please try again.');
      return;
    }

    const confirmFreePlan = window.confirm('Are you sure you want to sign up for the 7-day free plan?');
    if (!confirmFreePlan) return;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const planData = {
      customerId: customer.id,
      planId: 1,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: startDate.toISOString(),
      email: user.email
    };

    try {
      setLoading(true);
      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/CustomerPlans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        alert('Plan registered successfully.');
        navigate('/manage-services');
      } else {
        const errorMessage = await response.text();
        console.error("Failed to register plan:", errorMessage);
        alert('Failed to register plan. Please try again.');
      }
    } catch (error) {
      console.error('Error registering plan:', error);
      alert('Failed to register plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaidPlanSelection = async (priceId) => {
    if (!customer) {
      alert('Failed to fetch customer ID. Please try again.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ priceId, domain: window.location.origin }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error('Error redirecting to Stripe:', error);
          alert('Failed to initiate payment. Please try again.');
        }
      } else {
        const errorMessage = await response.text();
        console.error("Failed to create checkout session:", errorMessage);
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !customer) {
    return <div className="loading-overlay"><div className="loader"></div></div>;
  }

  return (
    <div className="choose-plan">
      <h2>Choose Your Plan</h2>
      {error && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="close-button" onClick={() => window.location.reload()}>&times;</span>
            <p>{error}</p>
          </div>
        </div>
      )}
      <div className="plan-options">
        <div className="plan-card" onClick={handleFreePlanSelection}>
          <h3>Free Trial</h3>
          <p>Free trial 7-day plan</p>
        </div>
        <div className="plan-card" onClick={() => handlePaidPlanSelection('price_1PPuEyKxd7UNSlf8Y9Mu7EOl')}>
          <h3>Basic Plan</h3>
          <p>Monitor up to 5 services. $5/month</p>
        </div>
        <div className="plan-card" onClick={() => handlePaidPlanSelection('price_1PPuGMKxd7UNSlf8Yqt0tWmB')}>
          <h3>Pro Plan</h3>
          <p>Monitor up to 15 services. $10/month</p>
        </div>
        <div className="plan-card" onClick={() => handlePaidPlanSelection('price_1PPuRAKxd7UNSlf8qINbc2iV')}>
          <h3>Enterprise Plan</h3>
          <p>Monitor up to 50 services. $25/month</p>
        </div>
      </div>
      
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default ChoosePlan;
