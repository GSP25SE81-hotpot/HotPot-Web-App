// StaffLayout.tsx
import React, { useState } from "react";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarHeader, {
  drawerWidth,
} from "./Header/SidebarHeader/SidebarHeader";
import "./Layout.scss";

const ManagerLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile); //track drawer - closed by default on mobile
  
  return (
    <div className="staff-layout">
      {/* Pass `open` and `setOpen` to SidebarHeader */}
      <SidebarHeader open={open} setOpen={setOpen} />
      <Box
        component="main"
        className="main-content"
        sx={{
          transition: "margin 0.3s ease", // for smooth transition
          marginLeft: isMobile ? 0 : (open ? `${drawerWidth}px` : "0px"),
          width: isMobile ? "100%" : (open ? `calc(100% - ${drawerWidth}px)` : "100%"),
          backgroundColor: "#fafafa",
        }}
      >
        {/* This Toolbar pushes the content below the AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </div>
  );
};

export default ManagerLayout;
