import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { NewEquipmentFailure } from "../../../types/equipmentFailure";

interface EquipmentFailureFormProps {
  newReport: NewEquipmentFailure;
  setNewReport: React.Dispatch<React.SetStateAction<NewEquipmentFailure>>;
  handleLogFailure: () => Promise<void>;
}

const EquipmentFailureForm: React.FC<EquipmentFailureFormProps> = ({
  newReport,
  setNewReport,
  handleLogFailure,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Log New Equipment Failure
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Equipment Name"
            value={newReport.name}
            onChange={(e) =>
              setNewReport({ ...newReport, name: e.target.value })
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Equipment Type</InputLabel>
            <Select
              value={newReport.equipmentType}
              label="Equipment Type"
              onChange={(e) =>
                setNewReport({ ...newReport, equipmentType: e.target.value })
              }
            >
              <MenuItem value="utensil">Utensil</MenuItem>
              <MenuItem value="hotpot">Hot Pot</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Equipment ID"
            type="number"
            value={newReport.equipmentId}
            onChange={(e) =>
              setNewReport({ ...newReport, equipmentId: e.target.value })
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Issue Description"
            value={newReport.description}
            onChange={(e) =>
              setNewReport({ ...newReport, description: e.target.value })
            }
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button variant="contained" onClick={handleLogFailure}>
            Submit Failure Report
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EquipmentFailureForm;
