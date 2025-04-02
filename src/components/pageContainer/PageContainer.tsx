// src/components/common/PageContainer.tsx
import React, { ReactNode } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Paper elevation={3}>
          <Box p={3}>{children}</Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PageContainer;
