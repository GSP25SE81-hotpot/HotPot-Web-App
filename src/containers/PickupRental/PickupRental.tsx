// src/pages/Staff/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage.tsx
import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MyAssignments from "./MyAssignments/MyAssignments";
import PendingPickups from "./PendingPickups/PendingPickups";
import OverdueRentals from "./OverdueRentals/OverdueRentals";
import {
  StyledContainer,
  StyledPaper,
  SectionHeading,
  StyledDivider,
} from "../../components/StyledComponents";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rental-tabpanel-${index}`}
      aria-labelledby={`rental-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `rental-tab-${index}`,
    "aria-controls": `rental-tabpanel-${index}`,
  };
}

export const PickupRental: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Phân tích tham số tab từ URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const tabIndex = parseInt(tabParam);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 2) {
        setTabValue(tabIndex);
      }
    }
  }, [location.search]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Cập nhật URL với giá trị tab mới mà không tải lại trang
    navigate(`?tab=${newValue}`, { replace: true });
  };

  return (
    <StyledContainer maxWidth="xl">
      <Box sx={{ mt: 3, mb: 2 }}>
        <SectionHeading variant="h4" component="h1">
          Thu hồi thiết bị
        </SectionHeading>
        <Typography variant="body1" color="text.secondary">
          Quản lý thu hồi, trả thiết bị cho thuê và theo dõi các mục quá hạn
        </Typography>
      </Box>
      <StyledDivider />
      <StyledPaper sx={{ width: "100%", mb: 2, p: 0, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              py: 2,
              fontWeight: 600,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            },
          }}
        >
          <Tab label="Nhiệm vụ của tôi" {...a11yProps(0)} />
          <Tab label="Đang chờ lấy hàng" {...a11yProps(1)} />
          <Tab label="Thuê quá hạn" {...a11yProps(2)} />
        </Tabs>
      </StyledPaper>
      <TabPanel value={tabValue} index={0}>
        <MyAssignments />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PendingPickups />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <OverdueRentals />
      </TabPanel>
    </StyledContainer>
  );
};
