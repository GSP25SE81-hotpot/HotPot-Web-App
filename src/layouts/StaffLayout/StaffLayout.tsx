import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./Header/TopBar/TopBar";
import "./Layout.scss";
import Footer from "./Footer/Footer";

const StaffLayout: React.FC = () => {
  return (
    <div
      style={{
        margin: "0px",
        position: "relative",
        overflow: "auto",
        height: "100vh",
      }}
    >
      <div className="header-content">
        <TopBar />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default StaffLayout;
