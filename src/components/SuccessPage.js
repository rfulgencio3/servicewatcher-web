import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessPage.scss';

const SuccessPage = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/api/Payment/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <div className="loading-overlay"><div className="loader"></div></div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="success-page">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
          If you have any questions, please email <a href="mailto:contact@servicewatchcer.net">contact@servicewatchcer.net</a>.
        </p>
        <button onClick={() => navigate('/user-page')}>Go to Dashboard</button>
      </div>
    );
  }

  return null;
};

export default SuccessPage;
