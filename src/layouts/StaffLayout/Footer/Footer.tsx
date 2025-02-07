// Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-container">
        {/* About Section */}
        <div className="column">
          <h3>ABOUT US</h3>
          <ul>
            <li>
              <Link to="/about-us">Our Story</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-of-service">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="column">
          <h3>CUSTOMER SUPPORT</h3>
          <ul>
            <li>
              <Link to="/shipping-policy">Shipping &amp; Delivery</Link>
            </li>
            <li>
              <Link to="/payment-methods">Payment Methods</Link>
            </li>
            <li>
              <Link to="/warranty-policy">Warranty &amp; Returns</Link>
            </li>
            <li>
              <Link to="/refund-policy">Refund Policy</Link>
            </li>
            <li>
              <Link to="/complaint-policy">Complaint Handling</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="column">
          <h3>STAFF QUICK LINKS</h3>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/manage-contracts">Manage Contracts</Link>
            </li>
            <li>
              <Link to="/equipment-status">Equipment Status</Link>
            </li>
            <li>
              <Link to="/maintenance-schedule">Maintenance Schedule</Link>
            </li>
            <li>
              <Link to="/feedback">Customer Feedback</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        &copy; 2024 Hotpot Rental Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
