import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { StyledBadge } from "../../../components/manager/styles/ChatStyles";
import { ChatSessionDto } from "../../../types/chat";

interface ChatHeaderProps {
  selectedChat: ChatSessionDto;
  onEndChat: () => void;
  onJoinChat: (managerId: number) => void;
  currentUserId?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedChat,
  onEndChat,
  onJoinChat,
  currentUserId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) => theme.palette.background.paper,
        opacity: 0.8,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
            {selectedChat.customerName?.charAt(0) || "C"}
          </Avatar>
        </StyledBadge>
        <Box>
          <Typography variant="subtitle1" fontWeight="500">
            {selectedChat.customerName || "Khách hàng"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedChat.topic || "No topic"}
          </Typography>
        </Box>
      </Box>

      <IconButton onClick={handleMenuOpen} aria-label="chat options">
        <MoreVert />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            onEndChat();
            handleMenuClose();
          }}
        >
          Kết thúc trò chuyện
        </MenuItem>

        {!selectedChat.managerId && currentUserId && (
          <MenuItem
            onClick={() => {
              onJoinChat(currentUserId);
              handleMenuClose();
            }}
          >
            Tham gia trò chuyện
          </MenuItem>
        )}

        {selectedChat.managerId === currentUserId && (
          <MenuItem onClick={handleMenuClose}>Đã tham gia trò chuyện</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default React.memo(ChatHeader);
