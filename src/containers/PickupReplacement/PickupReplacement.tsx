// src/pages/Dashboard.tsx
import { Divider, Tab } from "@mui/material";
import React, { useState } from "react";
import PageContainer from "../../components/pageContainer/PageContainer";
import {
  DashboardContainer,
  SectionTitle,
  StyledTabs,
  TabPanelContainer,
  TabsContainer,
} from "../../components/staff/styles/pickupReplacementStyles";
import ReplacementList from "./replacement/ReplacementList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && <TabPanelContainer>{children}</TabPanelContainer>}
    </div>
  );
};

const PickupReplacement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <PageContainer title="Bảng Điều Khiển Nhân Viên">
      <DashboardContainer>
        <TabsContainer>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="Yêu Cầu Thay Thế" />
          </StyledTabs>

          <Divider />

          <TabPanel value={tabValue} index={0}>
            <SectionTitle variant="h6">
              Yêu Cầu Thay Thế Được Giao Cho Bạn
            </SectionTitle>
            <ReplacementList />
          </TabPanel>
        </TabsContainer>
      </DashboardContainer>
    </PageContainer>
  );
};

export default PickupReplacement;
