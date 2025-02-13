import { Circle, Send, Warning } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  sender: "customer" | "staff";
  text: string;
  timestamp: Date;
}

interface CustomerChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  lastActivity: Date;
  messages: Message[];
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

const MessageBubble = styled(Box)<{ isStaff?: boolean }>(
  ({ theme, isStaff }) => ({
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: isStaff ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
    background: isStaff
      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
      : theme.palette.grey[100],
    boxShadow: `0 4px 12px ${alpha(
      isStaff ? theme.palette.primary.main : theme.palette.common.black,
      0.08
    )}`,
    color: isStaff ? "white" : "inherit",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 16px ${alpha(
        isStaff ? theme.palette.primary.main : theme.palette.common.black,
        0.12
      )}`,
    },
  })
);

const AnimatedListItem = styled(ListItemButton)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  borderRadius: 12,
  margin: "4px 8px",
  "&:hover": {
    transform: "translateX(4px)",
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  },
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 30,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: "blur(8px)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.12)}`,
    },
  },
}));

const ChatWithCustomer: React.FC = () => {
  const theme = useTheme();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [customerChats, setCustomerChats] = useState<CustomerChat[]>([
    {
      id: "1",
      name: "John Doe",
      avatar: "J",
      lastMessage: "Hey, I have an issue with my order!",
      unread: 2,
      lastActivity: new Date(),
      messages: [
        {
          sender: "customer",
          text: "Hey, I have an issue with my order!",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          sender: "staff",
          text: "Sure, let me check that for you.",
          timestamp: new Date(Date.now() - 1800000),
        },
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "J",
      lastMessage: "When will my package arrive?",
      unread: 0,
      lastActivity: new Date(Date.now() - 7200000),
      messages: [
        {
          sender: "customer",
          text: "When will my package arrive?",
          timestamp: new Date(Date.now() - 7200000),
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const handleSend = () => {
    if (input.trim() && selectedChat) {
      const newMessage: Message = {
        sender: "staff",
        text: input,
        timestamp: new Date(),
      };

      setCustomerChats((chats) =>
        chats.map((chat) =>
          chat.id === selectedChat
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: input,
                lastActivity: new Date(),
              }
            : chat
        )
      );
      setInput("");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEscalate = () => {
    alert("The issue has been escalated to higher support.");
  };

  const selectedCustomer = customerChats.find((c) => c.id === selectedChat);

  return (
    <StyledPaper
      elevation={3}
      sx={{
        width: "80vw",
        height: "80vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 280,
          borderRight: "1px solid",
          borderColor: "divider",
          overflowY: "auto",
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: "bold" }}>
          Customer Chats
        </Typography>
        <List sx={{ flex: 1 }}>
          {customerChats.map((chat) => (
            <AnimatedListItem
              key={chat.id}
              selected={selectedChat === chat.id}
              onClick={() => setSelectedChat(chat.id)}
            >
              <ListItemAvatar>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {chat.avatar}
                  </Avatar>
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText
                primary={chat.name}
                secondary={chat.lastMessage}
                slotProps={{
                  secondary: {
                    noWrap: true,
                    color: "text.secondary",
                  },
                }}
              />
              <Box sx={{ textAlign: "right", minWidth: 60 }}>
                <Typography variant="caption" color="text.secondary">
                  {new Date(chat.lastActivity).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                {chat.unread > 0 && (
                  <Circle
                    sx={{ fontSize: 12, color: "primary.main", mt: 0.5 }}
                  />
                )}
              </Box>
            </AnimatedListItem>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedCustomer ? (
          <>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                {selectedCustomer.avatar}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="500">
                  {selectedCustomer.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Online
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                bgcolor: alpha(theme.palette.background.default, 0.6),
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {selectedCustomer.messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "staff" ? "flex-end" : "flex-start",
                  }}
                >
                  <MessageBubble isStaff={msg.sender === "staff"}>
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        opacity: 0.7,
                        color:
                          msg.sender === "staff"
                            ? "common.white"
                            : "text.primary",
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </MessageBubble>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(8px)",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <StyledInput
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  <Send />
                </IconButton>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Warning />}
                onClick={handleEscalate}
                size="small"
                sx={{ borderRadius: "20px", textTransform: "none" }}
              >
                Escalate Issue
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              bgcolor: alpha(theme.palette.background.default, 0.6),
            }}
          >
            <Typography variant="h6">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </StyledPaper>
  );
};

export default ChatWithCustomer;
