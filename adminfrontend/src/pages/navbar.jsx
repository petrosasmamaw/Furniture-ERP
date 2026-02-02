import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          ERP Admin
        </Link>
        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/dashboard" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
          <li><Link to="/balances" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-balance-scale"></i> Balances</Link></li>
          <li><Link to="/credits" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-credit-card"></i> Credits</Link></li>
          <li><Link to="/items" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-box"></i> Items</Link></li>
          <li><Link to="/machines" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-cogs"></i> Machines</Link></li>
          <li><Link to="/orders" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-shopping-cart"></i> Orders</Link></li>
          <li><Link to="/purchases" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-shopping-bag"></i> Purchases</Link></li>
          <li><Link to="/reserves" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-archive"></i> Reserves</Link></li>
          <li><Link to="/workers" className="navbar-link" onClick={() => setIsMenuOpen(false)}><i className="fas fa-users"></i> Workers</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
