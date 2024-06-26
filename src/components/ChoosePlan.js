import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCustomer from '../hooks/useCustomer';
import './ChoosePlan.scss';

const ChoosePlan = ({ user }) => {
  const navigate = useNavigate();
  const { customer, loading: customerLoading, error } = useCustomer(user);
  const [loading, setLoading] = useState(false);

  const handlePlanSelection = async (planId, duration) => {
    if (!customer) {
      alert('Failed to fetch customer ID. Please try again.');
      return;
    }

    if (planId === 1) {
      const confirmFreePlan = window.confirm('Você tem certeza de inscrever no plano gratuito de duração de 7 dias?');
      if (!confirmFreePlan) return;

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration);

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
      alert('Você será redirecionado para o site de pagamento.');
      const stripeLinks = {
        2: 'https://buy.stripe.com/8wMg05bejgEz61qbII',
        3: 'https://buy.stripe.com/9AQcNT96bewr1LaeUV',
        4: 'https://buy.stripe.com/5kA0171DJ0FBfC0cMO'
      };
      window.location.href = stripeLinks[planId];
    }
  };

  const sendConfirmationEmail = async (planData) => {
    try {
      const response = await fetch('https://servicewatcher-mailservice.azurewebsites.net/api/Email/send', {
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

  if (customerLoading || loading) {
    return <div className="loading-overlay"><div className="loader"></div></div>;
  }

  return (
    <div className="choose-plan">
      <h2>Choose Your Plan</h2>
      {error && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="close-button" onClick={() => window.location.reload()}>&times;</span>
            <p>Failed to fetch customer information. Please try again later.</p>
          </div>
        </div>
      )}
      <div className="plan-options">
        <div className="plan-card" onClick={() => handlePlanSelection(1, 7)}>
          <h3>Free Trial</h3>
          <p>Free trial 7-day plan</p>
        </div>
        <div className="plan-card" onClick={() => handlePlanSelection(2, 30)}>
          <h3>Basic Plan</h3>
          <p>Monitor up to 5 services. $5/month</p>
        </div>
        <div className="plan-card" onClick={() => handlePlanSelection(3, 30)}>
          <h3>Pro Plan</h3>
          <p>Monitor up to 15 services. $10/month</p>
        </div>
        <div className="plan-card" onClick={() => handlePlanSelection(4, 30)}>
          <h3>Enterprise Plan</h3>
          <p>Monitor up to 50 services. $25/month</p>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlan;
