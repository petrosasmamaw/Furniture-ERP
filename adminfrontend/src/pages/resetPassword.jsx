import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../slice/authSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await dispatch(resetPassword({ email })).unwrap();
      setMessage('If an account exists, a password reset email has been sent. Please check your inbox.');
    } catch (err) {
      setMessage(err || 'Failed to send reset email');
    }
  };

  return (
    <div className="page-container" style={{ marginLeft: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="form-section auth-card">
        <h3 className="title-with-icon"><span className="section-icon" aria-hidden="true"><i className="fas fa-unlock-keyhole" /></span>Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fas fa-envelope inline-icon" />Enter your email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {error && <p className="error-text">{error}</p>}
          {message && <p style={{ color: '#064E3B', marginTop: 10 }}>{message}</p>}
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Sending...' : <><i className="fas fa-paper-plane" />Send Reset Email</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
