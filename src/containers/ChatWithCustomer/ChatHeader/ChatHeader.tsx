// src/components/Chat/components/ChatHeader/ChatHeader.tsx
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
  selectedChat: ChatSessionDto; // Phiên trò chuyện đang được chọn
  onEndChat: () => void; // Hàm kết thúc trò chuyện
  onAssignManager: (managerId: number) => void; // Gán người quản lý
  currentUserId?: number; // ID người dùng hiện tại (tuỳ chọn)
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedChat,
  onEndChat,
  onAssignManager,
  currentUserId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Mở menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Đóng menu
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
            Đang trực tuyến
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
        <MenuItem onClick={handleMenuClose}>Xem hồ sơ khách hàng</MenuItem>
        {!selectedChat.managerId && (
          <MenuItem
            onClick={() => {
              onAssignManager(currentUserId || 0);
              handleMenuClose();
            }}
          >
            Gán cho tôi
          </MenuItem>
        )}
        {selectedChat.managerId === currentUserId && (
          <MenuItem onClick={handleMenuClose}>Đã được gán cho tôi</MenuItem>
        )}
        {selectedChat.managerId === currentUserId && (
          <MenuItem
            onClick={() => {
              onAssignManager(0);
              handleMenuClose();
            }}
          >
            Bỏ gán khỏi tôi
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default React.memo(ChatHeader);
