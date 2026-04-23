import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, loadSession } from '../slice/authSlice';
import { useNavigate } from 'react-router-dom';
import authBg from '../assets/authBackground.png';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session, loading, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwStrength, setPwStrength] = useState(0);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => { dispatch(loadSession()); }, [dispatch]);
  useEffect(() => { if (session) navigate('/dashboard'); }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setInfoMessage('');
      if (password !== confirm) {
        setInfoMessage('Passwords do not match');
        return;
      }
      const res = await dispatch(signUp({ email, password })).unwrap();
      // If Supabase returns a session, navigate; otherwise prompt email confirmation
      if (res?.session) {
        navigate('/dashboard');
      } else {
        window.alert('Registration successful — please confirm in your email');
        navigate('/login');
      }
    } catch (err) {
      // error text is handled via slice state
      setInfoMessage(err || 'Registration failed');
    }
  };

  const calcStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score += 40;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[0-9]/.test(pw)) score += 20;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    setPwStrength(Math.min(100, score));
  };

  return (
    <div className="auth-center">
      <div className="auth-bg" style={{ backgroundImage: `url(${authBg})` }} />
      <div className="auth-hero">
        <div className="auth-hero-left">
          <h1 className="hero-title title-with-icon"><span className="section-icon" aria-hidden="true"><i className="fas fa-user-plus" /></span>Create an account</h1>
          <p className="hero-sub">Join your team and manage products, purchases and orders in one place.</p>
          <button type="button" className="btn hero-cta"><i className="fas fa-circle-info" />Learn More</button>
        </div>

        <div className="auth-hero-right">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-avatar">EA</div>
              <div className="auth-title">Create your account</div>
              <div className="auth-sub">Quickly create an admin account</div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><i className="fas fa-envelope inline-icon" />Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="email" autoComplete="email" />
              </div>
              <div className="form-group">
                <label><i className="fas fa-lock inline-icon" />Password</label>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); calcStrength(e.target.value); }} required aria-label="password" autoComplete="new-password" />
                <div className="password-strength"><i style={{ width: pwStrength + '%' }} /></div>
              </div>
              <div className="form-group">
                <label><i className="fas fa-key inline-icon" />Confirm password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required aria-label="confirm-password" autoComplete="new-password" />
              </div>
              {error && <p className="error-text">{error}</p>}
              {infoMessage && <p className="error-text">{infoMessage}</p>}
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? <><span className="spinner"/> Registering...</> : <><i className="fas fa-user-check" />Register</>}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
