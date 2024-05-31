import React from 'react';
import { Link } from 'react-router-dom';
import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      <h1>About ServiceWatcher</h1>
      <p>
        ServiceWatcher is a comprehensive monitoring solution designed to ensure the uptime and performance of your websites and services. In today's digital age, maintaining the reliability and availability of online services is crucial for business success and customer satisfaction. With ServiceWatcher, you can proactively monitor your critical services, receive instant notifications of any issues, and take timely action to resolve them.
      </p>
      <p>
        Our platform continuously checks the status of your registered services, analyzing their performance and detecting any downtime or anomalies. If a service goes down or experiences any issues, ServiceWatcher immediately alerts you via email or message, allowing you to address the problem before it impacts your users.
      </p>
      <p>
        The benefits of using ServiceWatcher include:
      </p>
      <ul>
        <li>Proactive Monitoring: Ensure your services are always up and running with continuous checks.</li>
        <li>Instant Alerts: Get notified instantly if any of your services experience downtime or performance issues.</li>
        <li>Comprehensive Dashboard: Access detailed insights and performance metrics of your services through our user-friendly dashboard.</li>
        <li>Improved Reliability: Maintain the reliability and availability of your services, enhancing user experience and satisfaction.</li>
        <li>Cost Savings: Avoid costly downtime and potential revenue loss by addressing issues promptly.</li>
      </ul>
      <Link to="/">
        <button className="back-btn">Back to Home</button>
      </Link>
    </div>
  );
};

export default About;
