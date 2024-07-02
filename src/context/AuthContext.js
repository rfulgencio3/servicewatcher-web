import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchCustomer(storedUser);
    }
    setLoading(false);
  }, []);

  const fetchCustomer = async (user) => {
    try {
      const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/Customer/email', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'email': user.email,
        }
      });

      if (response.ok) {
        const customerData = await response.json();
        setCustomer(customerData);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      setCustomer(null);
    }
  };

  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    fetchCustomer(user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ user, customer, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
