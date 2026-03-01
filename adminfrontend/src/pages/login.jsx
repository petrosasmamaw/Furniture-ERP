import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signIn, loadSession } from '../slice/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session, loading, error } = useSelector((s) => s.auth);
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
      // error shown from slice state
    }
  };

  return (
    <div className="page-container" style={{ marginLeft: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="form-section" style={{ maxWidth: 420, width: '100%' }}>
        <h3>Sign In</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/reset-password" style={{ color: '#0b63a6', display: 'inline-block', marginTop: 10 }}>Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
