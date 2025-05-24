// src/components/Chat/ChatHeader.tsx
import React from "react";
import { Box, Button, Typography, Chip } from "@mui/material";
import { ChatSessionDto } from "../../../types/chat";

interface ChatHeaderProps {
  chat: ChatSessionDto;
  onEndChat: () => void;
  onJoinChat: () => void;
  isManager: boolean;
  canJoin: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onEndChat,
  onJoinChat,
  isManager,
  canJoin,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box>
        <Typography variant="h6">
          {chat.customerName || "Khách hàng không xác định"}
          {!chat.isActive && (
            <Chip
              size="small"
              color="default"
              label="Đã kết thúc"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {chat.topic || "Không có chủ đề"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {chat.managerId
            ? `Được phân cho: ${chat.managerName || "Không xác định"}`
            : "Chưa được phân công"}
        </Typography>
      </Box>

      <Box>
        {canJoin && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onJoinChat}
            sx={{ mr: 1 }}
          >
            Tham gia
          </Button>
        )}

        {isManager && chat.isActive && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onEndChat}
          >
            Kết thúc
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(ChatHeader);
