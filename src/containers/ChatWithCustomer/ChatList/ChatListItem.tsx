// src/components/Chat/components/ChatList/ChatListItem.tsx
import React from "react";
import {
  Avatar,
  Badge,
  Box,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  AnimatedListItem,
  StyledBadge,
} from "../../../components/manager/styles/ChatStyles";
import { ChatSessionDto } from "../../../types/chat";

interface ChatListItemProps {
  chat: ChatSessionDto;
  isSelected: boolean;
  onClick: () => void;
  unreadCount?: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isSelected,
  onClick,
  unreadCount = 0,
}) => (
  <AnimatedListItem selected={isSelected} onClick={onClick}>
    <ListItemAvatar>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {chat.customerName?.charAt(0) || "C"}
        </Avatar>
      </StyledBadge>
    </ListItemAvatar>
    <ListItemText
      primary={chat.customerName || "Customer"}
      secondary={chat.topic || "No topic"}
      slotProps={{
        secondary: {
          noWrap: true,
          color: "text.secondary",
        },
      }}
    />
    <Box sx={{ textAlign: "right", minWidth: 60 }}>
      {unreadCount > 0 && (
        <Badge badgeContent={unreadCount} color="primary" sx={{ mb: 1 }} />
      )}
      <Typography variant="caption" color="text.secondary">
        {chat.updatedAt
          ? new Date(chat.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(chat.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
      </Typography>
    </Box>
  </AnimatedListItem>
);

export default React.memo(ChatListItem);
