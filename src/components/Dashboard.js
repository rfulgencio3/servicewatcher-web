import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = ({ user }) => {
  const [customer, setCustomer] = useState(null);
  const [pingServiceNumberByHour, setPingServiceNumberByHour] = useState([]);
  const [pingFailureDistribution, setPingFailureDistribution] = useState([]);
  const [pingFailuresPercentage, setPingFailuresPercentage] = useState([]);
  const [totalPingsByService, setTotalPingsByService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#00FFFF', '#FF00FF', '#800000', '#008080', '#808000'];

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`https://servicewatcher-planservice.azurewebsites.net/api/Customer/email/${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        }
      });

      if (response.ok) {
        const customerData = await response.json();
        console.log("Customer Data:", customerData); // Log the customer data
        setCustomer(customerData);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Failed to fetch customer ID.');
    }
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(`https://servicewatcher-planservice.azurewebsites.net/api/Dashboards/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'customerId': customer?.id, // Passing customerId in the headers
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Data for ${endpoint}:`, data); // Log the data for each endpoint
        setter(data);
      } else if (response.status === 404) {
        setter([]);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Failed to fetch data.');
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchCustomer();
    };
    fetchInitialData();
  }, [user.email]);

  useEffect(() => {
    if (customer) {
      const fetchAllData = async () => {
        setLoading(true);
        await fetchData('ping-service-number-by-hour', setPingServiceNumberByHour);
        await fetchData('ping-failure-distribution', setPingFailureDistribution);
        await fetchData('ping-failures-percentage', setPingFailuresPercentage);
        await fetchData('total-pings-by-service', setTotalPingsByService);
        setLoading(false);
      };
      fetchAllData();
    }
  }, [customer]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Ping Logs Dashboard</h2>
        {customer && (
          <div className="customer-info">
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
          </div>
        )}
      </header>

      <div className="charts-panel">
        <div className="chart-card">
          <h3>Ping Service Number by Hour</h3>
          {pingServiceNumberByHour.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pingServiceNumberByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pingHour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pingCount" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data found for Ping Service Number by Hour.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Ping Failure Distribution by Service</h3>
          {pingFailureDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pingFailureDistribution}
                  dataKey="failureCount"
                  nameKey="url"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {pingFailureDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No data found for Ping Failure Distribution by Service.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Ping Failures Percentage by Service</h3>
          {pingFailuresPercentage.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pingFailuresPercentage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pingDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="failurePercentage" fill="#FF0000" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data found for Ping Failures Percentage by Service.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Total Pings by Service</h3>
          {totalPingsByService.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalPingsByService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="url" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalPings" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data found for Total Pings by Service.</p>
          )}
        </div>
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default Dashboard;
