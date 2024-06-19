import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard = ({ user }) => {
  const [pingLogs, setPingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPingLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://servicewatcher-planservice.azurewebsites.net/api/PingLogs/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          setPingLogs(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (error) {
        setError('Failed to fetch ping logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchPingLogs();
  }, [user]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Ping Logs Dashboard</h2>
      <div className="table-container">
        <table className="ping-logs-table">
          <thead>
            <tr>
              <th>Service URL</th>
              <th>Service Type</th>
              <th>Ping Time</th>
              <th>Observation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pingLogs.map((log, index) => (
              <tr key={index} className={log.isActive ? 'active' : 'inactive'}>
                <td>{log.serviceUrl}</td>
                <td>{log.serviceType}</td>
                <td>{new Date(log.pingTime).toLocaleString()}</td>
                <td>{log.observation}</td>
                <td className={`ping-status ${log.isActive ? 'active' : 'inactive'}`}>
                  {log.isActive ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="back-button" onClick={() => navigate('/user-page')}>Back to Dashboard</button>
    </div>
  );
};

export default Dashboard;
