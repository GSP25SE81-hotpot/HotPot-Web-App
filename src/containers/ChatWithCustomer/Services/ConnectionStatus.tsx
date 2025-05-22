import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface ConnectionStatusProps {
  isConnected: boolean;
  chatSessionsCount: number;
  onReconnect: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  chatSessionsCount,
  onReconnect,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="caption"
          color={isConnected ? "success.main" : "error.main"}
          sx={{ mr: 1 }}
        >
          {isConnected ? "Đã kết nối" : "Mất kết nối"}
        </Typography>
        {!isConnected && (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={onReconnect}
            sx={{ fontSize: "0.7rem", py: 0.5 }}
          >
            Kết nối lại
          </Button>
        )}
      </Box>
      <Typography
        variant="caption"
        color={chatSessionsCount > 0 ? "text.secondary" : "warning.main"}
      >
        {chatSessionsCount > 0
          ? `${chatSessionsCount} cuộc trò chuyện`
          : "0 cuộc trò chuyện"}
      </Typography>
    </Box>
  );
};

export default React.memo(ConnectionStatus);
