import React, { useState } from 'react';
import './Contact.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://servicewatcher-mailservice.azurewebsites.net/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'contact@servicewatcher.net',
          subject: `Contact Form Submission from ${formData.name}`,
          body: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setError(false);
      } else {
        setSuccess(false);
        setError(true);
      }
    } catch (error) {
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Message</button>
        {success && <p className="success">Email sent successfully!</p>}
        {error && <p className="error">Failed to send email. Please try again later.</p>}
      </form>
    </div>
  );
};

export default Contact;
