import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, loadSession } from '../slice/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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
      const res = await dispatch(signUp({ email, password })).unwrap();
      // If Supabase returns a session, navigate; otherwise prompt email confirmation
      if (res?.session) {
        navigate('/dashboard');
      } else {
        window.alert('Registration successful — please confirm in your email');
        navigate('/login');
      }
    } catch (err) {
      // error text is handled via slice state; optionally show alert
    }
  };

  return (
    <div className="page-container" style={{ marginLeft: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="form-section" style={{ maxWidth: 420, width: '100%' }}>
        <h3>Create Account</h3>
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
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
