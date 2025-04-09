import { Box, Tabs, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Components
export const DashboardContainer = styled(Box)(() => ({
  width: "100%",
}));

export const TabsContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  "& .MuiTab-root": {
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
    fontSize: "1rem",
  },
}));

export const TabPanelContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));
