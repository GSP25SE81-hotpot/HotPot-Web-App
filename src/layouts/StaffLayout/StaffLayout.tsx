// StaffLayout.tsx
import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
// import Footer from "./Footer/Footer";
import SidebarHeader, {
  drawerWidth,
} from "./Header/SidebarHeader/SidebarHeader";
import "./Layout.scss";

const StaffLayout: React.FC = () => {
  const [open, setOpen] = useState(false); //track drawer
  return (
    <div className="staff-layout">
      {/* Pass `open` and `setOpen` to SidebarHeader */}
      <SidebarHeader open={open} setOpen={setOpen} />
      <Box
        component="main"
        className="main-content"
        sx={{
          transition: "margin 0.3s ease", // for smooth transition
          marginLeft: open ? `${drawerWidth}px` : "0px",
          width: open ? `calc(100% -${drawerWidth}px)` : "100%",
          backgroundColor: "#fafafa",
        }}
      >
        {/* This Toolbar pushes the content below the AppBar */}
        <Toolbar />
        <Outlet />
        {/* <Footer /> */}
      </Box>
    </div>
  );
};

export default StaffLayout;
