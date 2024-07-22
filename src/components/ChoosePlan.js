import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './ChoosePlan.scss';

const stripePromise = loadStripe('pk_test_51PP1NjKxd7UNSlf8BiD3GK13Oxee0VEa9CqCI4r5Wn3hJPRVq3OCnRNlW5eIw7vyatATTjmcsRF1tVP9LsGQ8oPp00CZSyIXg2');

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

  const handlePlanSelection = async (planId, priceId) => {
    if (!customer) {
      alert('Failed to fetch customer ID. Please try again.');
      return;
    }

    if (planId === 1) {
      const confirmFreePlan = window.confirm('Are you sure to sign up for the 7-day free plan?');
      if (!confirmFreePlan) return;

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      const planData = {
        customerId: customer.id,
        planId: planId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdAt: startDate.toISOString(),
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
          await sendConfirmationEmail(planData);
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
    } else {
      try {
        setLoading(true);
        console.log('Sending request to create checkout session with data:', {
          priceId,
          customerId: customer.id.toString(),
          customerEmail: user.email,
          domain: window.location.origin
        });
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Payment/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ priceId, customerId: customer.id.toString(), customerEmail: user.email, domain: window.location.origin }), // Ensure customerId is a string
        });

        if (response.ok) {
          const { sessionId } = await response.json();
          console.log('Session ID received:', sessionId);
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
    }
  };

  const sendConfirmationEmail = async (planData) => {
    try {
      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          to: user.email,
          subject: 'Plan Registration Confirmation',
          body: `Dear ${user.name},\n\nYou have successfully registered for a plan. Your plan details are as follows:\n\nPlan ID: ${planData.planId}\nStart Date: ${planData.startDate}\nEnd Date: ${planData.endDate}\n\nBest regards,\nServiceWatcher Team`,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send confirmation email.');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
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
        <div className="plan-card" onClick={() => handlePlanSelection(1)}>
          <h3>Free Trial</h3>
          <p>Free trial 7-day plan</p>
        </div>
        <div className="plan-card" onClick={() => handlePlanSelection(2, 'price_1A2B3C4D5E6F7G8H9I')}>
          <h3>Basic Plan</h3>
          <p>Monitor up to 5 services. $5/month</p>
        </div>
        <div className="plan-card" onClick={() => handlePlanSelection(3, 'price_1J2K3L4M5N6O7P8Q9R')}>
          <h3>Pro Plan</h3>
          <p>Monitor up to 15 services. $10/month</p>
        </div>
        <div className="plan-card" onClick={() => handlePlanSelection(4, 'price_1S2T3U4V5W6X7Y8Z9A')}>
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
