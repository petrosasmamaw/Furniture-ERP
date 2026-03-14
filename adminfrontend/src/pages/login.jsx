import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signIn, loadSession } from '../slice/authSlice';
import { useNavigate } from 'react-router-dom';
import authBg from '../assets/authBackground.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session, loading, error } = useSelector((s) => s.auth);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { dispatch(loadSession()); }, [dispatch]);

  useEffect(() => { if (session) navigate('/dashboard'); }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signIn({ email, password })).unwrap();
      // if signIn succeeded, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setMessage(err || 'Sign in failed');
    }
  };
  return (
    <div className="auth-center">
      <div className="auth-bg" style={{ backgroundImage: `url(${authBg})` }} />
      <div className="auth-hero">
        <div className="auth-hero-left">
          <h1 className="hero-title">Welcome!</h1>
          <p className="hero-sub">Manage your furniture ERP — orders, inventory and staff from one place.</p>
          <button type="button" className="btn hero-cta">Learn More</button>
        </div>

        <div className="auth-hero-right">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-avatar">EA</div>
              <div className="auth-title">Sign in to ERP Admin</div>
              <div className="auth-sub">Enter your account details to continue</div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="email" autoComplete="email" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-label="password" autoComplete="current-password" />
              </div>
              {error && <p className="error-text">{error}</p>}
              {message && <p className="error-text">{message}</p>}
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading && <span className="spinner" />} {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/reset-password" style={{ color: '#ffb3d6' }}>Forgot password?</Link>
                <Link to="/register" style={{ color: '#ffb3d6' }}>Create account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
