import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="column">
          <h3>VỀ CHÚNG TÔI</h3>
          <ul>
            <li>
              <Link to="/about-us">Giới thiệu SMMMS</Link>
            </li>
            <li>Liên hệ</li>
            <li>
              <Link to="/privacy-policy">
                Chính sách bảo mật thông tin cá nhân
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service">Điều khoản sử dụng</Link>
            </li>
          </ul>
        </div>
        <div className="column">
          <h3>HỖ TRỢ KHÁCH HÀNG</h3>
          <ul>
            <li>Chính sách vận chuyển, giao nhận</li>
            <li>Quy định và hình thức thanh toán</li>
            <li>Chính sách bảo hành, đổi trả</li>
            <li>Chính sách đổi, trả & hoàn tiền</li>
            <li>Chính sách giải quyết khiếu nại</li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        &copy; 2024 Công Ty Cổ Phần SMMMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
