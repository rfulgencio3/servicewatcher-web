import React, { useEffect, useState } from 'react';
import './Dashboard.scss';

const Dashboard = () => {
    const [services, setServices] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        // Chamar a API para obter os dados do usuário e serviços monitorados
        // const userData = await api.getUserData();
        // const servicesData = await api.getServices();
        // setUser(userData);
        // setServices(servicesData);
    }, []);

    return (
        <div className="dashboard">
            <header className="header">
                <h1>ServiceWatcher Dashboard</h1>
            </header>
            <main>
                <h2>Welcome, {user.name}</h2>
                <h3>Your Services</h3>
                <ul>
                    {services.map(service => (
                        <li key={service.id}>{service.url}</li>
                    ))}
                </ul>
            </main>
            <footer>
                <p>&copy; 2024 ServiceWatcher. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
