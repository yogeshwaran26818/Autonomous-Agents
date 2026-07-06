import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register } from '../services/authService';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      if (isRegisterMode) {
        await register(username, email, password);
        setSuccessMsg('Registration successful! You can now log in.');
        setIsRegisterMode(false);
        setPassword('');
      } else {
        await login(username, password);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(isRegisterMode ? 'Registration failed' : 'Invalid username or password');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Autonomous AI Agent</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isRegisterMode ? 'Create a new account' : 'Sign in to continue'}
        </p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: 'var(--error-color)', fontSize: '0.875rem' }}>{error}</div>}
          {successMsg && <div style={{ color: 'var(--success-color)', fontSize: '0.875rem' }}>{successMsg}</div>}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          {isRegisterMode && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isRegisterMode ? 'Register' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button" 
            style={{ 
              background: 'none', border: 'none', color: 'var(--primary-color)', 
              fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' 
            }}
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
              setSuccessMsg('');
            }}
          >
            {isRegisterMode ? "Log in here" : "Register here"}
          </button>
        </div>
        
        {!isRegisterMode && (
          <div className="demo-credentials">
            <strong>Demo Credentials</strong>
            <div>Username: demo_user</div>
            <div>Password: demo123</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
