import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { ChatMessageDto } from "../../../types/chat";
import useAuth from "../../../hooks/useAuth";

interface MessageItemProps {
  message: ChatMessageDto;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { auth } = useAuth();
  const user = auth.user;

  // Convert both to numbers for comparison to avoid type mismatches
  const isFromCurrentUser = Number(message.senderUserId) === Number(user?.id);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
        mb: 2.5,
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      {/* Show avatar for messages NOT from current user */}
      {!isFromCurrentUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            mr: 1,
            fontSize: "0.875rem",
            bgcolor: "secondary.main",
            boxShadow: 1,
          }}
        >
          {message.senderName?.charAt(0) || "C"}
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: "70%",
          padding: 2,
          borderRadius: 2,
          backgroundColor: isFromCurrentUser ? "primary.dark" : "#f0f0f0",
          color: isFromCurrentUser ? "white" : "text.primary",
          borderTopLeftRadius: isFromCurrentUser ? 2 : 0.5,
          borderTopRightRadius: isFromCurrentUser ? 0.5 : 2,
          boxShadow: 2,
          position: "relative",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: 3,
          },
        }}
      >
        {/* Optional sender name for non-user messages */}
        {!isFromCurrentUser && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 0.5,
              fontWeight: "bold",
              color: "secondary.main",
            }}
          >
            {message.senderName}
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{
            fontWeight: 400,
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}
        >
          {message.message}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 0.5,
            opacity: 0.8,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isFromCurrentUser
                ? "rgba(255,255,255,0.9)"
                : "text.secondary",
              fontWeight: 500,
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(MessageItem);
