import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../../../styles/Color/color";

interface DetailPopupProps {
  handleOpen?: any;
  handleClose?: any;
  detailData?: any;
}

const DetailPopup: React.FC<DetailPopupProps> = ({
  handleOpen,
  handleClose,
  detailData,
}) => {
  return (
    <>
      <Dialog open={handleOpen}>
        <Box
          sx={{
            bgcolor: colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DialogTitle color={colors.white}>Chi tiết</DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: colors.white }} />
          </IconButton>
        </Box>

        <DialogContent>
          <Typography>Đây là chi tiết</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DetailPopup;
