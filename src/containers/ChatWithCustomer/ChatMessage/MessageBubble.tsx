/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Chat/MessageBubble.tsx
import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { ChatMessageDto } from "../../../types/chat";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface MessageBubbleProps {
  message: ChatMessageDto;
  isFromCurrentUser: boolean;
  failed?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromCurrentUser,
  failed = false,
}) => {
  // Format time
  const formattedTime = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(message.createdAt), {
        addSuffix: true,
        locale: vi,
      });
    } catch (e) {
      return "Không rõ thời gian";
    }
  }, [message.createdAt]);

  // Is this a temporary message (being sent)
  const isTemporary = message.chatMessageId < 0;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: "70%",
          borderRadius: 2,
          backgroundColor: isFromCurrentUser
            ? "primary.main"
            : message.isBroadcast
            ? "rgba(255, 193, 7, 0.1)"
            : "rgba(0, 0, 0, 0.04)",
          color: isFromCurrentUser ? "white" : "text.primary",
          borderLeft: message.isBroadcast ? "3px solid #FFC107" : "none",
          opacity: isTemporary ? 0.7 : 1,
          border: failed ? "1px solid red" : "none",
        }}
      >
        {!isFromCurrentUser && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: "bold",
              color: message.isBroadcast ? "warning.main" : "secondary.main",
            }}
          >
            {message.senderName}
            {message.isBroadcast && " (Chưa phân công)"}
          </Typography>
        )}

        <Typography variant="body1">{message.message}</Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              color: isFromCurrentUser
                ? "rgba(255, 255, 255, 0.9)"
                : "text.secondary",
            }}
          >
            {isTemporary
              ? "Đang gửi..."
              : failed
              ? "Gửi thất bại"
              : formattedTime}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default React.memo(MessageBubble);
