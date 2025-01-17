import { Box } from "@mui/material";
import WorkAssignmentSchedule from "../../../containers/WorkAssignmentSchedule/WorkAssignmentSchedule";
import OverrideMuiTheme from "../../../theme/override";


export const WorkAssignmentSchedulePage = () => {
  return (
      <OverrideMuiTheme>
    <Box>
        <WorkAssignmentSchedule/>
    </Box>
      </OverrideMuiTheme>
  )
}
