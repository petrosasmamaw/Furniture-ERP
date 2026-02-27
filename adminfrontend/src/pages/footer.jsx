import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Furniture ERP</h3>
          <p className="muted">Crafted dashboards, beautiful operations.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <ul>
              <li>Catalog</li>
              <li>Pricing</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li>Docs</li>
              <li>Support</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>

        <div className="footer-legal">
          <p>© {new Date().getFullYear()} Furniture ERP — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
