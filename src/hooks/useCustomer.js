import { useState, useEffect } from 'react';

const useCustomer = (user) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
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
        } else {
          const errorData = await response.text();
          console.error('Error fetching customer:', errorData); // Log para depuração
          setError('Failed to fetch customer information. Please try again later.');
        }
      } catch (error) {
        console.error('Fetch error:', error); // Log para depuração
        setError('Failed to fetch customer information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [user.email, user.token]);

  return { customer, loading, error };
};

export default useCustomer;
