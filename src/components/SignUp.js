import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.scss';

const SignUp = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const sendWelcomeEmail = async (name, email) => {
    try {
      const response = await fetch('https://servicewatcher-mailservice.azurewebsites.net/api/Email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Welcome to ServiceWatcher!',
          body: `Dear ${name},\n\nWelcome to ServiceWatcher! We are thrilled to have you on board.\n\nBest regards,\nServiceWatcher Team`,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send welcome email.');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      setShowErrorModal(true);
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://servicewatcher-authservice.azurewebsites.net/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        await sendWelcomeEmail(name, email);

        // Perform login after successful registration and email sending
        const loginResponse = await fetch('https://servicewatcher-authservice.azurewebsites.net/api/Auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          const { token, name } = data;

          // Store the user data in localStorage
          localStorage.setItem('user', JSON.stringify({ email, token, name }));

          // Update global state
          setUser({ email, token, name });

          // Redirect to the user page
          navigate('/user-page');
        } else {
          setErrorMessage('Failed to login. Please try again.');
          setShowErrorModal(true);
        }
      } else {
        if (response.status === 409) {
          setErrorMessage('Failed to register. Email is already registered.');
        } else {
          const responseData = await response.text();
          if (response.status >= 400 && response.status < 500) {
            setErrorMessage(`Failed to register. ${responseData}`);
          } else {
            setErrorMessage('Failed to register. Please try again.');
          }
        }
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to register. Please try again.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="sign-up">
      {loading && <div className="loading-overlay"><div className="loader"></div></div>}
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <div className="password-container">
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
          </span>
        </div>
        <label>Confirm Password</label>
        <div className="password-container">
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
          </span>
        </div>
        {!passwordMatch && <p className="error-message">Passwords do not match</p>}
        <button type="submit" disabled={loading || !passwordMatch}>Sign Up</button>
      </form>

      {showErrorModal && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="close-button" onClick={() => setShowErrorModal(false)}>&times;</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
