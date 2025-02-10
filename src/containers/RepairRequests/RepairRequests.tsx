import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

interface RepairRequest {
  id: string;
  customerName: string;
  equipmentType: string;
  reportedDate: Date;
  status: "Pending" | "Scheduled" | "Resolved";
  description: string;
  replacementDate?: Date;
  resolutionNotes?: string;
}

const mockRequests: RepairRequest[] = [
  {
    id: "1",
    customerName: "John Doe",
    equipmentType: "Electric Hot Pot",
    reportedDate: new Date("2024-03-10"),
    status: "Pending",
    description: "Heating element not working properly",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    equipmentType: "Butane Stove",
    reportedDate: new Date("2024-03-11"),
    status: "Scheduled",
    description: "Gas leakage reported",
    replacementDate: new Date("2024-03-12"),
  },
  {
    id: "3",
    customerName: "Mike Johnson",
    equipmentType: "Portable Burner",
    reportedDate: new Date("2024-03-12"),
    status: "Resolved",
    description: "Ignition button stuck",
    replacementDate: new Date("2024-03-13"),
    resolutionNotes: "Replaced unit and verified proper operation",
  },
];

const StatusChip = ({ status }: { status: RepairRequest["status"] }) => {
  const theme = useTheme();
  const statusColors = {
    Pending: theme.palette.warning.main,
    Scheduled: theme.palette.info.main,
    Resolved: theme.palette.success.main,
  };

  return (
    <Chip
      label={status}
      sx={{ backgroundColor: statusColors[status], color: "white" }}
    />
  );
};

const RepairRequests: React.FC = () => {
  const [requests, setRequests] = useState<RepairRequest[]>(mockRequests);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [resolutionMessage, setResolutionMessage] = useState("");

  const columns: GridColDef[] = [
    { field: "id", headerName: "Case ID", width: 120 },
    { field: "customerName", headerName: "Customer", width: 180 },
    { field: "equipmentType", headerName: "Equipment Type", width: 180 },
    {
      field: "reportedDate",
      headerName: "Reported Date",
      width: 180,
      valueFormatter: () => new Date().toLocaleDateString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      sortable: false,
    },
  ];

  const handleScheduleReplacement = (requestId: string) => {
    if (!selectedDate) return;

    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "Scheduled", replacementDate: selectedDate }
          : req
      )
    );
    setSelectedDate(null);
  };

  const handleResolveRequest = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "Resolved", resolutionNotes: resolutionMessage }
          : req
      )
    );
    setResolutionMessage("");
  };

  const renderDetailPanel = ({ row }: { row: RepairRequest }) => (
    <Box sx={{ p: 4, borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="h6">Issue Details</Typography>
          <Paper sx={{ p: 2, mt: 1 }}>
            <Typography>{row.description}</Typography>
          </Paper>

          {row.resolutionNotes && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Resolution Notes
              </Typography>
              <Paper sx={{ p: 2, mt: 1 }}>
                <Typography>{row.resolutionNotes}</Typography>
              </Paper>
            </>
          )}
        </Grid>

        <Grid size={{ xs: 6 }}>
          {row.status === "Pending" && (
            <>
              <Typography variant="h6">Schedule Replacement</Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <DateTimePicker
                  label="Replacement Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
                <Button
                  variant="contained"
                  disabled={!selectedDate}
                  onClick={() => handleScheduleReplacement(row.id)}
                >
                  Schedule
                </Button>
              </Box>
            </>
          )}

          {row.status === "Scheduled" && (
            <>
              <Typography variant="h6">Customer Communication</Typography>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Resolution Message"
                  value={resolutionMessage}
                  onChange={(e) => setResolutionMessage(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  disabled={!resolutionMessage}
                  onClick={() => handleResolveRequest(row.id)}
                >
                  Mark as Resolved
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Equipment Failure Reports
        </Typography>

        <Box sx={{ height: 600, width: "100%", mb: 2 }}>
          <DataGrid
            rows={requests}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: {
                  fileName: "repair_requests_export",
                  delimiter: ",",
                  utf8WithBom: true,
                },
              },
            }}
            getRowHeight={() => "auto"}
            sx={{
              "& .MuiDataGrid-cell": { py: 2 },
              "& .MuiDataGrid-row": { maxHeight: "none !important" },
            }}
            disableRowSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: "reportedDate", sort: "desc" }],
              },
            }}
            getDetailPanelContent={renderDetailPanel}
          />
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default RepairRequests;
