// src/components/manager/RentalHistory.tsx
import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { format } from "date-fns";
import {
  getRentalHistoryByUser,
  getRentalHistoryByUtensil,
  getRentalHistoryByHotpot,
} from "../../../api/Services/rentalService";
import { RentalHistoryItem } from "../../../types/rentalTypes";

// Import styled components
import {
  StyledContainer,
  StyledPaper,
} from "../../../components/StyledComponents";

// Import rental history specific styled components
import {
  HistoryTitle,
  StyledTabs,
  StyledTab,
  SearchContainer,
  SearchField,
  SearchButton,
  StyledTableContainer,
  HeaderTableCell,
  BodyTableCell,
  StyledTableRow,
  StatusChip,
  TabPanelContainer,
  ResultsContainer,
} from "../../../components/manager/styles/RentalHistoryStyles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <TabPanelContainer
      role="tabpanel"
      hidden={value !== index}
      id={`rental-history-tabpanel-${index}`}
      aria-labelledby={`rental-history-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </TabPanelContainer>
  );
};

const RentalHistory: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [userId, setUserId] = useState("");
  const [utensilId, setUtensilId] = useState("");
  const [hotpotId, setHotpotId] = useState("");
  const [rentalHistory, setRentalHistory] = useState<RentalHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setRentalHistory([]);
    setError(null);
    setSearchPerformed(false);
  };

  const handleUserSearch = async () => {
    if (!userId) {
      setError("Please enter a user ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const history = await getRentalHistoryByUser(parseInt(userId, 10));
      setRentalHistory(history);
      setSearchPerformed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch rental history"
      );
      setRentalHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUtensilSearch = async () => {
    if (!utensilId) {
      setError("Please enter a utensil ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const history = await getRentalHistoryByUtensil(parseInt(utensilId, 10));
      setRentalHistory(history);
      setSearchPerformed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch rental history"
      );
      setRentalHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHotpotSearch = async () => {
    if (!hotpotId) {
      setError("Please enter a hotpot inventory ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const history = await getRentalHistoryByHotpot(parseInt(hotpotId, 10));
      setRentalHistory(history);
      setSearchPerformed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch rental history"
      );
      setRentalHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="xl">
      <StyledPaper elevation={0} sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          <HistoryTitle variant="h4">Rental History</HistoryTitle>
        </Box>

        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="By User" />
          <StyledTab label="By Utensil" />
          <StyledTab label="By Hotpot" />
        </StyledTabs>

        <TabPanel value={tabValue} index={0}>
          <SearchContainer>
            <SearchField
              label="User ID"
              variant="outlined"
              size="small"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              fullWidth
            />
            <SearchButton
              variant="contained"
              color="primary"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
              onClick={handleUserSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </SearchButton>
          </SearchContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SearchContainer>
            <SearchField
              label="Utensil ID"
              variant="outlined"
              size="small"
              value={utensilId}
              onChange={(e) => setUtensilId(e.target.value)}
              placeholder="Enter utensil ID"
              fullWidth
            />
            <SearchButton
              variant="contained"
              color="primary"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
              onClick={handleUtensilSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </SearchButton>
          </SearchContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SearchContainer>
            <SearchField
              label="Hotpot Inventory ID"
              variant="outlined"
              size="small"
              value={hotpotId}
              onChange={(e) => setHotpotId(e.target.value)}
              placeholder="Enter hotpot inventory ID"
              fullWidth
            />
            <SearchButton
              variant="contained"
              color="primary"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
              onClick={handleHotpotSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </SearchButton>
          </SearchContainer>
        </TabPanel>

        <ResultsContainer>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  alignItems: "center",
                },
              }}
            >
              {error}
            </Alert>
          )}
          {searchPerformed && (
            <>
              {rentalHistory.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-icon": {
                      alignItems: "center",
                    },
                  }}
                >
                  No rental history found
                </Alert>
              ) : (
                <StyledTableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <HeaderTableCell>ID</HeaderTableCell>
                        <HeaderTableCell>Order ID</HeaderTableCell>
                        <HeaderTableCell>Customer</HeaderTableCell>
                        <HeaderTableCell>Equipment</HeaderTableCell>
                        <HeaderTableCell>Rental Start</HeaderTableCell>
                        <HeaderTableCell>Expected Return</HeaderTableCell>
                        <HeaderTableCell>Actual Return</HeaderTableCell>
                        <HeaderTableCell>Status</HeaderTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rentalHistory.map((rental) => (
                        <StyledTableRow key={rental.id}>
                          <BodyTableCell>{rental.id}</BodyTableCell>
                          <BodyTableCell>{rental.orderId}</BodyTableCell>
                          <BodyTableCell>{rental.customerName}</BodyTableCell>
                          <BodyTableCell>{rental.equipmentName}</BodyTableCell>
                          <BodyTableCell>
                            {format(
                              new Date(rental.rentalStartDate),
                              "MMM dd, yyyy"
                            )}
                          </BodyTableCell>
                          <BodyTableCell>
                            {format(
                              new Date(rental.expectedReturnDate),
                              "MMM dd, yyyy"
                            )}
                          </BodyTableCell>
                          <BodyTableCell>
                            {rental.actualReturnDate
                              ? format(
                                  new Date(rental.actualReturnDate),
                                  "MMM dd, yyyy"
                                )
                              : "Not returned yet"}
                          </BodyTableCell>
                          <BodyTableCell>
                            <StatusChip
                              label={rental.status}
                              status={rental.status.toLowerCase()}
                              size="small"
                            />
                          </BodyTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              )}
            </>
          )}
        </ResultsContainer>
      </StyledPaper>
    </StyledContainer>
  );
};

export default RentalHistory;
