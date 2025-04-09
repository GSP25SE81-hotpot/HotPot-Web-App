import {
    TableCell,
    TableContainer,
    TableContainerProps,
    TableHead,
    TableRow,
  } from "@mui/material";
  import { alpha, styled } from "@mui/material/styles";
  
  export const StyledTableContainer: React.FC<TableContainerProps> = (props) => (
    <TableContainer
      {...props}
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: (theme) =>
          `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
        marginBottom: (theme) => theme.spacing(3),
        ...props.sx,
      }}
    />
  );
  
  export const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  }));
  
  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    padding: theme.spacing(2),
  }));
  
  export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: alpha(theme.palette.action.hover, 0.05),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.action.hover, 0.1),
    },
    transition: "background-color 0.2s ease",
  }));
  