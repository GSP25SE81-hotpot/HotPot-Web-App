// src/components/Chat/ChatList.tsx
import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Typography,
} from "@mui/material";
import { ChatSessionDto } from "../../../types/chat";

interface ChatListProps {
  chats: ChatSessionDto[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  unreadChats: Set<number>;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  unreadChats,
}) => {
  // Sort chats: unread first, then by creation date (newest first)
  const sortedChats = [...chats].sort((a, b) => {
    // Unread chats first
    const aUnread = unreadChats.has(a.chatSessionId);
    const bUnread = unreadChats.has(b.chatSessionId);
    if (aUnread && !bUnread) return -1;
    if (!aUnread && bUnread) return 1;

    // Then by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <List disablePadding>
        {sortedChats.length > 0 ? (
          sortedChats.map((chat) => {
            const isSelected = chat.chatSessionId === selectedChatId;
            const isUnread = unreadChats.has(chat.chatSessionId);

            return (
              <ListItem
                key={chat.chatSessionId}
                disablePadding
                sx={{
                  borderLeft: isUnread ? "3px solid #FFC107" : "none",
                }}
              >
                <ListItemButton
                  selected={isSelected}
                  onClick={() => onSelectChat(chat.chatSessionId)}
                  sx={{
                    py: 1.5,
                    "&.Mui-selected": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!chat.isActive}
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: isUnread ? "warning.main" : "primary.main",
                        }}
                      >
                        {chat.customerName?.charAt(0) || "K"}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isUnread ? "bold" : "normal",
                          color: isUnread ? "warning.main" : "inherit",
                        }}
                      >
                        {chat.customerName || "Khách hàng không xác định"}
                      </Typography>
                    }
                    secondary={
                      <Box component="span">
                        <Typography variant="body2" noWrap>
                          {chat.topic || "Không có chủ đề"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {chat.isActive
                            ? chat.managerId
                              ? `Đã phân công`
                              : "Chưa phân công"
                            : "Đã kết thúc"}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText primary="Không có cuộc trò chuyện nào" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default React.memo(ChatList);
