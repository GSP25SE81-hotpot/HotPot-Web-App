// src/components/OrderHistory/OrderHistoryQuickActions.tsx
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
// import PrintIcon from "@mui/icons-material/Print";
import { Box, Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

interface OrderHistoryQuickActionsProps {
  onExport: () => void;
  onPrint: () => void;
  onToggleView: (view: "list" | "grid") => void;
  currentView: "list" | "grid";
  onToggleFilterPanel: () => void;
  isFilterPanelOpen: boolean;
  isExporting?: boolean; // Add loading state for export
}

const OrderHistoryQuickActions: React.FC<OrderHistoryQuickActionsProps> = ({
  onExport,
  //   onPrint,
  onToggleFilterPanel,
  isFilterPanelOpen,
  isExporting = false,
}) => {
  return (
    <ActionsContainer>
      <Tooltip title="Xuất ra Excel">
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? "Đang xuất..." : "Xuất Excel"}
        </Button>
      </Tooltip>

      {/* <Tooltip title="In danh sách">
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={onPrint}>
          In
        </Button>
      </Tooltip> */}

      <Box sx={{ flexGrow: 1 }} />

      <Tooltip title={isFilterPanelOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}>
        <Button
          variant="outlined"
          startIcon={
            isFilterPanelOpen ? <FilterListOffIcon /> : <FilterListIcon />
          }
          onClick={onToggleFilterPanel}
        >
          {isFilterPanelOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </Button>
      </Tooltip>
    </ActionsContainer>
  );
};

export default OrderHistoryQuickActions;
