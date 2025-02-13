import React from "react";
import { Box } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <>
      <div>fddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</div>
      <Box
        sx={{
          padding: {
            mobile: 1,
            tablet: 2,
            laptop: 3,
            desktop: 4,
          },
          backgroundColor: {
            mobile: "lightblue",
            tablet: "lightgreen",
            laptop: "lightpink",
            desktop: "lightgray",
          },
        }}
      >
        test custom
      </Box>
    </>
  );
};

export default Dashboard;
