import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../slice/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const { session } = useSelector((s) => s.auth);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
    } catch (e) {
      // ignore error but continue to navigate
    }
    navigate('/login');
  };

  return (
    <>
      <div className="top-color-bar"></div>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="navbar-logo">
            ERP Admin
          </Link>
          <ul className="navbar-menu">
            {session ? (
              <>
                <li><Link to="/dashboard" className="navbar-link"><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
                <li><Link to="/products" className="navbar-link"><i className="fas fa-chair"></i> Products</Link></li>
                <li><Link to="/balances" className="navbar-link"><i className="fas fa-money-bill-wave"></i> Balances</Link></li>
                <li><Link to="/credits" className="navbar-link"><i className="fas fa-credit-card"></i> Credits</Link></li>
                <li><Link to="/items" className="navbar-link"><i className="fas fa-box"></i> Items</Link></li>
                <li><Link to="/machines" className="navbar-link"><i className="fas fa-cogs"></i> Machines</Link></li>
                <li><Link to="/orders" className="navbar-link"><i className="fas fa-shopping-cart"></i> Orders</Link></li>
                <li><Link to="/purchases" className="navbar-link"><i className="fas fa-shopping-bag"></i> Purchases</Link></li>
                <li><Link to="/price-calculator" className="navbar-link"><i className="fas fa-calculator"></i> Price#</Link></li>
                <li><Link to="/workers" className="navbar-link"><i className="fas fa-users"></i> Workers</Link></li>
                <li style={{ marginTop: 'auto', padding: '12px' }}>
                  <button className="btn btn-sm" onClick={handleSignOut}>Sign Out</button>
                </li>
              </>
            ) : (
              <>
                <li style={{ marginTop: 12 }}><Link to="/login" className="navbar-link">Sign In</Link></li>
                <li><Link to="/register" className="navbar-link">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
