import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha, styled } from "@mui/material/styles";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  "& .MuiTypography-h4": {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(8px)",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: "16px 16px 0 0",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  "& .MuiDataGrid-row": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: "translateY(-2px)",
    },
  },
})) as typeof DataGrid;

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.background.paper,
      0.95
    )}, ${alpha(theme.palette.background.default, 0.95)})`,
    backdropFilter: "blur(10px)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

// Utility function
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

interface IEquipment {
  id: string;
  name: string;
  type: string;
  lastInspection: Date;
  nextInspection: Date;
  status: "excellent" | "good" | "fair" | "poor";
}

const mockEquipment = (): IEquipment[] => [
  {
    id: "EQ-001",
    name: "Electric Hot Pot Pro",
    type: "Electric",
    lastInspection: new Date("2024-03-01"),
    nextInspection: new Date("2024-04-01"),
    status: "good",
  },
  {
    id: "EQ-002",
    name: "Butane Portable Cooker",
    type: "Gas",
    lastInspection: new Date("2024-02-15"),
    nextInspection: new Date("2024-03-25"),
    status: "fair",
  },
  {
    id: "EQ-003",
    name: "Premium Induction Cooktop",
    type: "Induction",
    lastInspection: new Date("2024-03-10"),
    nextInspection: new Date("2024-04-10"),
    status: "poor",
  },
];

const StatusChip = styled(Chip)<{ status: IEquipment["status"] }>(
  ({ theme, status }) => ({
    borderRadius: 12,
    padding: "4px 12px",
    fontWeight: 600,
    backgroundColor: alpha(
      {
        excellent: theme.palette.success.main,
        good: theme.palette.info.main,
        fair: theme.palette.warning.main,
        poor: theme.palette.error.main,
      }[status],
      0.8
    ),
    color: "#fff",
    transition: "all 0.2s ease-in-out",
    "&:hover": { transform: "scale(1.05)" },
  })
);

const EquipmentConditionLog: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<IEquipment[]>(
    mockEquipment()
  );
  const [selectedEquipment, setSelectedEquipment] = useState<IEquipment | null>(
    null
  );
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [newInspectionDate, setNewInspectionDate] = useState<Date | null>(null);

  const columns: GridColDef<IEquipment>[] = [
    { field: "id", headerName: "ID", width: 140, flex: 0.2 },
    { field: "name", headerName: "Equipment Name", width: 250, flex: 0.3 },
    { field: "type", headerName: "Type", width: 150, flex: 0.2 },
    {
      field: "lastInspection",
      headerName: "Last Inspection",
      width: 180,
      flex: 0.3,
      valueFormatter: ({ value }) => formatDate(value),
    },
    {
      field: "nextInspection",
      headerName: "Next Inspection",
      width: 180,
      flex: 0.3,
      valueFormatter: ({ value }) => formatDate(value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      flex: 0.2,
      renderCell: ({ value }) => (
        <StatusChip status={value} label={value.toUpperCase()} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleScheduleInspection(params.row.id)}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 2,
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: 2,
            },
          }}
        >
          Schedule Inspection
        </Button>
      ),
    },
  ];

  // Dialog handler
  const handleScheduleInspection = (equipmentId: string) => {
    const equipment = equipmentList.find((eq) => eq.id === equipmentId);
    if (equipment) {
      setSelectedEquipment(equipment);
      setNewInspectionDate(equipment.nextInspection); // Initialize with current date
    }
    setInspectionDialogOpen(true);
  };

  const handleScheduleNextInspection = () => {
    if (!selectedEquipment || !newInspectionDate) return;

    const updatedEquipment = {
      ...selectedEquipment,
      nextInspection: newInspectionDate,
    };

    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === selectedEquipment.id ? updatedEquipment : eq))
    );

    setInspectionDialogOpen(false);
    setNewInspectionDate(null); // Reset date state
  };

  const renderDetailPanel = ({ row }: GridRowParams<IEquipment>) => (
    <Box sx={{ p: 3, borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
      <Grid container spacing={3} sx={{ py: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" gutterBottom>
            Inspection Schedule
          </Typography>
          <StyledPaper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>
                Next Inspection: {formatDate(row.nextInspection)}
              </Typography>
              <Typography>
                Last Inspection: {formatDate(row.lastInspection)}
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ position: "fixed", bottom: 24, right: 24 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleScheduleInspection(row.id)} // Fixed line
              sx={{
                borderRadius: 28,
                padding: "16px 32px",
                boxShadow: 3,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              Schedule Inspection
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Equipment Status Monitoring
        </Typography>

        <Box sx={{ height: 600, width: "100%" }}>
          <StyledDataGrid<IEquipment>
            key={JSON.stringify(equipmentList)} // Add this line
            rows={equipmentList}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
            disableRowSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: "nextInspection", sort: "asc" }],
              },
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                py: 2,
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-row": {
                maxHeight: "none !important",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              },
              "& .MuiDataGrid-toolbarContainer": {
                padding: 2,
                gap: 2,
              },
            }}
            getDetailPanelContent={renderDetailPanel}
          />
        </Box>

        {/* Schedule Inspection Dialog */}
        <StyledDialog
          open={inspectionDialogOpen}
          onClose={() => {
            setInspectionDialogOpen(false);
            setNewInspectionDate(null);
          }}
        >
          <DialogTitle>Schedule Next Inspection</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Next Inspection Date"
                value={newInspectionDate}
                onChange={(newValue) => setNewInspectionDate(newValue)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInspectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleNextInspection} // Use the new handler
              variant="contained"
              disabled={!newInspectionDate} // Disable if no date selected
            >
              Schedule
            </Button>
          </DialogActions>
        </StyledDialog>
      </StyledContainer>
    </LocalizationProvider>
  );
};

export default EquipmentConditionLog;
