// src/components/Chat/components/ChatMessages/MessageItem.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { MessageBubble } from "../../../components/manager/styles/ChatStyles";
import { ChatMessageDto } from "../../../types/chat";
import useAuth from "../../../hooks/useAuth";

interface MessageItemProps {
  message: ChatMessageDto;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { auth } = useAuth();
  const user = auth.user;
  const isStaff = message.senderUserId === user?.uid;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isStaff ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <MessageBubble isStaff={isStaff}>
        <Typography variant="body2">{message.message}</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isStaff ? "common.white" : "text.primary",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {isStaff && (
            <Box
              component="span"
              sx={{ ml: 0.5, display: "flex", alignItems: "center" }}
            >
              {message.isRead ? (
                <span style={{ color: "#44b700" }}>✓✓</span>
              ) : (
                "✓"
              )}
            </Box>
          )}
        </Box>
      </MessageBubble>
    </Box>
  );
};

export default React.memo(MessageItem);
