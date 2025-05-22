import { Box, Button, Typography } from "@mui/material";
import React from "react";

interface DebugPanelProps {
  isConnected: boolean;
  userId?: number;
  chatSessionsCount: number;
  selectedChatId: number | null;
  error: string | null;
  accessToken?: string;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  isConnected,
  userId,
  chatSessionsCount,
  selectedChatId,
  error,
  accessToken,
  onClose,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        right: 0,
        bgcolor: "rgba(0,0,0,0.8)",
        color: "white",
        p: 2,
        borderRadius: 1,
        maxWidth: 400,
        maxHeight: 300,
        overflow: "auto",
        zIndex: 1000,
        fontSize: "0.75rem",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Debug Info
      </Typography>
      <pre>
        Connection: {isConnected ? "Connected" : "Disconnected"}
        {"\n"} User ID: {userId}
        {"\n"} Sessions: {chatSessionsCount}
        {"\n"} Selected Chat: {selectedChatId}
        {"\n"} Error: {error ? error.toString() : "None"}
        {"\n"} Token: {accessToken ? "Present" : "Missing"}
        {"\n"} Token from localStorage:{" "}
        {localStorage.getItem("userInfor") ? "Present" : "Missing"}
      </pre>
      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={onClose}
        sx={{ mt: 1 }}
      >
        Close
      </Button>
    </Box>
  );
};

export default React.memo(DebugPanel);
