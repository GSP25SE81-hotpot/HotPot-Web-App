import React from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Stack,
  useTheme
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Grid2 from "@mui/material/Grid2"; 
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  border: `1px solid ${theme.palette.grey[200]}`,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  width: 48,
  height: 48,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  minHeight: '100vh',
  padding: theme.spacing(4),
}));

const ManageRentals: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

  return (
    <DashboardContainer>
    <Box sx={{ maxWidth: 'xl', margin: '0 auto' }}>
      <Grid2 container spacing={4}>
        <Grid2 size={{xs:12}}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            mb={4}
          >
            <Typography variant="h4" component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.primary 
                }}>
              Manage Rentals and Equipment
            </Typography>
          </Stack>
        </Grid2>

        {/* Active Rentals Section */}
        <Grid2 size={{xs:12, md:6}}>
        <StyledCard>
              <StyledCardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 1 
                      }}
                    >
                      Active Rentals
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ fontSize: '1.1rem' }}
                    >
                      10 Rentals Currently Active
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <ActionButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate("/manage-rental-status")}
                      endIcon={<ArrowForwardIcon />}
                    >
                      View Details
                    </ActionButton>
                    <StyledIconButton aria-label="notifications">
                      <NotificationsIcon />
                    </StyledIconButton>
                  </Stack>
                </Stack>
              </StyledCardContent>
            </StyledCard>
          </Grid2>

        {/* Equipment Availability Section */}  
        <Grid2 size={{xs:12, md:6}}>
        <StyledCard>
              <StyledCardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 1 
                      }}
                    >
                      Equipment Availability
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ fontSize: '1.1rem' }}
                    >
                      5 Items Under Maintenance
                    </Typography>
                  </Box>
                  <ActionButton 
                    variant="contained" 
                    color="secondary"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                  >
                    View Equipment
                  </ActionButton>
                </Stack>
              </StyledCardContent>
            </StyledCard>
          </Grid2>
        </Grid2>
      </Box>
    </DashboardContainer>
  );
};

export default ManageRentals;
