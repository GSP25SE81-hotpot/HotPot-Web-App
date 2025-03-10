// src/containers/WorkAssignmentSchedule/WorkAssignmentSchedule.tsx

import React from "react";
import { Box } from "@mui/material";
import WorkAssignmentSchedule from "../../../containers/WorkAssignmentSchedule/WorkAssignmentSchedule";
import { AuthContextProvider } from "../../../context/AuthContext";

const WorkAssignmentSchedulePage: React.FC = () => {
  return (
    <AuthContextProvider>
      <Box>
        <WorkAssignmentSchedule />
      </Box>
    </AuthContextProvider>
  );
};

export default WorkAssignmentSchedulePage;
